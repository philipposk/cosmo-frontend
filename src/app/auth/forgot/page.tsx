import { ForgotForm } from "@/components/auth/ForgotForm";

export default function ForgotPage() {
  return (
    <div className="content" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="eyebrow">Account recovery</div>
      <h1 className="display">Forgot password</h1>
      <p className="sub">
        Enter your email and we&apos;ll send a reset link. In development the link is logged to the backend
        console.
      </p>
      <div style={{ marginTop: 18 }}>
        <ForgotForm />
      </div>
    </div>
  );
}
