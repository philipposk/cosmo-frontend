import { ResetForm } from "@/components/auth/ResetForm";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <div className="content" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="eyebrow">Account recovery</div>
      <h1 className="display">Set a new password</h1>
      <div style={{ marginTop: 18 }}>
        <ResetForm token={token ?? ""} />
      </div>
    </div>
  );
}
