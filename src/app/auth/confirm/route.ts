import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      if (data.user) {
        await prisma.profile.upsert({
          where: { id: data.user.id },
          update: {},
          create: { id: data.user.id, email: data.user.email ?? "" },
        });
      }
      redirect(next);
    }
  }

  redirect("/login?error=Could not verify your email link. Please try again.");
}
