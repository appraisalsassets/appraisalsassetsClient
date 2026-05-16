const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://appraisalsassets-server-delta.vercel.app/api";
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private isRenderBotProtection(data: any): boolean {
    return (
      data?.requestId && data?.message?.toLowerCase().includes("recaptcha")
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false,
    retryCount = 0,
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(response.statusText || "Invalid server response");
      }

      if (this.isRenderBotProtection(data) && retryCount < 3) {
        await this.delay(1500 * (retryCount + 1));
        return this.request(endpoint, options, isRetry, retryCount + 1);
      }

      // Handle 401 Unauthorized (Token expired)
      if (
        response.status === 401 &&
        !isRetry &&
        !endpoint.includes("/auth/login") &&
        !endpoint.includes("/auth/refresh-token")
      ) {
        try {
          const refreshRes = await this.refreshToken();
          if (refreshRes.success) {
            return this.request(endpoint, options, true);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || "Network error");
    }
  }

  // Auth endpoints
  async signup(name: string, email: string, password: string) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async verifyEmail(email: string, otp: string) {
    return this.request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.accessToken) {
      this.setAccessToken(response.accessToken);
    }

    return response;
  }

  async logout() {
    const response = await this.request("/auth/logout", {
      method: "POST",
    });
    this.setAccessToken(null);
    return response;
  }

  async verifyToken() {
    return this.request("/auth/verify-token", {
      method: "GET",
    });
  }

  async refreshToken() {
    const response = await this.request("/auth/refresh-token", {
      method: "POST",
    });

    if (response.success && response.accessToken) {
      this.setAccessToken(response.accessToken);
    }

    return response;
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request("/dashboard/stats", {
      method: "GET",
    });
  }

  async getRecentProperties() {
    return this.request("/dashboard/recent-properties", {
      method: "GET",
    });
  }

  async getRecentInquiries() {
    return this.request("/dashboard/recent-inquiries", {
      method: "GET",
    });
  }

  // Properties endpoints
  async getPropertyFormOptions() {
    return this.request("/properties/form-options", {
      method: "GET",
    });
  }

  async getProperties(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/properties${queryString}`, {
      method: "GET",
    });
  }

  async getProperty(id: string) {
    return this.request(`/properties/${id}`, {
      method: "GET",
    });
  }

  private async parseFetchResponse(response: Response): Promise<ApiResponse> {
    let data: ApiResponse;
    try {
      data = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(response.statusText || "Invalid server response");
      }
      throw new Error("Invalid server response");
    }
    if (!response.ok) {
      throw new Error(data.message || response.statusText || "Request failed");
    }
    return data;
  }

  async createProperty(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/properties`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    return this.parseFetchResponse(response);
  }

  async updateProperty(id: string, formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/properties/${id}`, {
      method: "PUT",
      headers,
      body: formData,
      credentials: "include",
    });

    return this.parseFetchResponse(response);
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}`, {
      method: "DELETE",
    });
  }

  // Developers endpoints
  async getDevelopers(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/developers${queryString}`, { method: "GET" });
  }

  async getTrustedPartners() {
    return this.request("/developers/trusted-partners", { method: "GET" });
  }

  async getDevelopersAdmin() {
    return this.request("/developers/admin/all", { method: "GET" });
  }

  async getDeveloperBySlug(slug: string) {
    return this.request(`/developers/${slug}`, { method: "GET" });
  }

  async createDeveloper(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/developers`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    return this.parseFetchResponse(response);
  }

  async updateDeveloper(id: string, formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/developers/${id}`, {
      method: "PUT",
      headers,
      body: formData,
      credentials: "include",
    });

    return this.parseFetchResponse(response);
  }

  async deleteDeveloper(id: string) {
    return this.request(`/developers/${id}`, { method: "DELETE" });
  }

  // Developer Projects endpoints
  async getDeveloperProjects(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/developer-projects${queryString}`, { method: "GET" });
  }

  async getDeveloperProject(id: string) {
    return this.request(`/developer-projects/${id}`, { method: "GET" });
  }

  async createDeveloperProject(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/developer-projects`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    return response.json();
  }

  async updateDeveloperProject(id: string, formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/developer-projects/${id}`, {
      method: "PUT",
      headers,
      body: formData,
      credentials: "include",
    });

    return response.json();
  }

  async deleteDeveloperProject(id: string) {
    return this.request(`/developer-projects/${id}`, { method: "DELETE" });
  }

  // Testimonials endpoints
  async getTestimonials(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/testimonials${queryString}`, {
      method: "GET",
    });
  }

  async getTestimonial(id: string) {
    return this.request(`/testimonials/${id}`, {
      method: "GET",
    });
  }

  async createTestimonial(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/testimonials`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    return response.json();
  }

  async updateTestimonial(id: string, formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/testimonials/${id}`, {
      method: "PUT",
      headers,
      body: formData,
      credentials: "include",
    });

    return response.json();
  }

  async deleteTestimonial(id: string) {
    return this.request(`/testimonials/${id}`, {
      method: "DELETE",
    });
  }

  async toggleTestimonialStatus(id: string, isActive: boolean) {
    return this.request(`/testimonials/${id}/toggle-status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  }

  async toggleFeaturedStatus(id: string, isFeatured: boolean) {
    return this.request(`/testimonials/${id}/toggle-featured`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured }),
    });
  }

  // Inquiries endpoints
  async createInquiry(inquiryData: {
    name: string;
    email: string;
    phone: string;
    inquiry_type?: string;
    property_title?: string;
    property_reference?: string;
    property_id?: string;
    message?: string;
  }) {
    return this.request("/inquiries", {
      method: "POST",
      body: JSON.stringify(inquiryData),
    });
  }

  async getInquiries(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/inquiries${queryString}`, {
      method: "GET",
    });
  }

  async getInquiry(id: string) {
    return this.request(`/inquiries/${id}`, {
      method: "GET",
    });
  }

  async updateInquiry(id: string, data: { status?: string; notes?: string }) {
    return this.request(`/inquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInquiry(id: string) {
    return this.request(`/inquiries/${id}`, {
      method: "DELETE",
    });
  }

  // Blog endpoints
  async getBlogPosts(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/blog${queryString}`, {
      method: "GET",
    });
  }

  async getBlogPost(id: string) {
    return this.request(`/blog/${id}`, {
      method: "GET",
    });
  }

  async createBlogPost(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/blog`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    return response.json();
  }

  async updateBlogPost(id: string, formData: FormData) {
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/blog/${id}`, {
      method: "PUT",
      headers,
      body: formData,
      credentials: "include",
    });

    return this.parseFetchResponse(response);
  }

  async deleteBlogPost(id: string) {
    return this.request(`/blog/${id}`, {
      method: "DELETE",
    });
  }

  async toggleBlogPostStatus(id: string, status: string) {
    return this.request(`/blog/${id}/toggle-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async toggleBlogFeatured(id: string, isFeatured: boolean) {
    return this.request(`/blog/${id}/toggle-featured`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured }),
    });
  }

  // Site Content endpoints
  async getSiteContent() {
    return this.request("/content", { method: "GET" });
  }

  async updateHeroContent(data: {
    badgeText?: string;
    headline?: string;
    description?: string;
  }) {
    return this.request("/content/hero", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateAboutContent(data: {
    headline?: string;
    description?: string;
    mission?: string;
    vision?: string;
  }) {
    return this.request("/content/about", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateContactContent(data: {
    officeAddress?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    officeHours?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
      youtube?: string;
    };
    mapEmbedUrl?: string;
  }) {
    return this.request("/content/contact", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Settings endpoints
  async getAppSettings() {
    return this.request("/settings", { method: "GET" });
  }

  async updateAppSettings(data: {
    general?: {
      applicationName?: string;
      supportEmail?: string;
      supportPhone?: string;
      whatsappNumber?: string;
      timezone?: string;
      maintenanceMode?: boolean;
    };
    security?: {
      sessionTimeoutMinutes?: number;
      allowNewAdminCreation?: boolean;
    };
  }) {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getAdminAccounts() {
    return this.request("/settings/admins", { method: "GET" });
  }

  async createAdminAccount(data: {
    name: string;
    email: string;
    password: string;
    accessLevel: "full" | "limited";
    permissions?: Record<string, boolean>;
  }) {
    return this.request("/settings/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAdminAccount(
    id: string,
    data: {
      name?: string;
      accessLevel?: "full" | "limited";
      permissions?: Record<string, boolean>;
      isActive?: boolean;
    },
  ) {
    return this.request(`/settings/admins/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAdminAccount(id: string) {
    return this.request(`/settings/admins/${id}`, { method: "DELETE" });
  }

  // Subscriber endpoints
  async subscribe(data: {
    name?: string;
    email: string;
    phone?: string;
    interests?: string[];
  }) {
    return this.request("/subscribers/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSubscribers(params?: Record<string, any>) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/subscribers${queryString}`, { method: "GET" });
  }

  async getSubscriber(id: string) {
    return this.request(`/subscribers/${id}`, { method: "GET" });
  }

  async createSubscriber(data: {
    name?: string;
    email: string;
    phone?: string;
    interests?: string[];
    status?: string;
    notes?: string;
  }) {
    return this.request("/subscribers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSubscriber(id: string, data: Record<string, any>) {
    return this.request(`/subscribers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSubscriber(id: string) {
    return this.request(`/subscribers/${id}`, { method: "DELETE" });
  }

  async toggleSubscriberStatus(id: string, status: string) {
    return this.request(`/subscribers/${id}/toggle-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
