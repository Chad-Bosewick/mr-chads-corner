"use client";

import { useState } from "react";

const MAX_MESSAGE_LENGTH = 600;
const EMAIL = "Addtemi270@gmail.com";

export function buildMailtoUrl(name: string, role: string, message: string): string {
  const subject = [name.trim(), role.trim()].filter(Boolean).join(" — ");
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

const fieldClass =
  "mt-2 w-full min-h-11 rounded-lg border border-[#151515]/15 bg-white px-4 font-sans text-[#151515] outline-none transition-colors focus-visible:border-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]";
const labelClass =
  "font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]";

export function ContactForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName) {
      setError("Please add your name.");
      return;
    }
    if (!trimmedMessage) {
      setError("Please write a short message.");
      return;
    }
    setError("");
    window.location.href = buildMailtoUrl(trimmedName, role, trimmedMessage);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Contact form"
      className="mt-12 max-w-[680px] space-y-6"
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact-role" className={labelClass}>
          Role
        </label>
        <input
          id="contact-role"
          type="text"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          autoComplete="organization-title"
          className={fieldClass}
          placeholder="Designer, Founder, Student…"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <span className="font-sans text-xs tabular-nums text-[var(--color-text-muted)]">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          className={`${fieldClass} resize-y`}
          placeholder="A quick hello and why you're reaching out…"
        />
      </div>

      {error && (
        <p role="alert" className="font-sans text-sm text-[#A43718]">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#151515] px-7 font-sans text-[#f5f2ee] transition-colors duration-[var(--duration-fast)] hover:bg-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
      >
        Send message
      </button>

      <p className="font-sans text-sm text-[var(--color-text-muted)]">
        This opens your email app with your message ready to send.
      </p>
    </form>
  );
}
