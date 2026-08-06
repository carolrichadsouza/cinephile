import { describe, expect, it, vi } from "vitest";
import { apiFetch, ApiError } from "../api";

describe("apiFetch", () => {
  it("sends JSON requests and returns parsed data", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        )
    );
    await expect(
      apiFetch("/test", { method: "POST", body: { name: "Testing" } })
    ).resolves.toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Testing" }),
      })
    );
  });
  it("adds the bearer token for authenticated requests", async () => {
    localStorage.setItem("cinephile_token", "abc");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }))
    );
    await apiFetch("/logs", { auth: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer abc" }),
      })
    );
  });
  it("throws ApiError with server message", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        )
    );
    await expect(apiFetch("/private")).rejects.toEqual(
      expect.objectContaining<ApiError>({
        status: 401,
        name: expect.any(String),
        message: "Unauthorized",
      })
    );
  });
  it("returns undefined for 204 responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    );
    await expect(
      apiFetch("/item", { method: "DELETE" })
    ).resolves.toBeUndefined();
  });
});
