import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { login as loginApi } from "@/services/api/auth.api";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { setTokens } from "@/services/authTokens";
import type { AxiosError } from "axios";
import { useUser } from "@/context/UserContext";
import { getProfile } from "@/services/api/user.api";

const signinSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});
type SigninForm = z.infer<typeof signinSchema>;

export default function Signin() {
  const { login } = useAuth();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninForm) => {
    try {
      setServerError(null);
      const res = await loginApi(data.email, data.password);
      setTokens(res);
      login(res.accessToken);

      // ✅ fetch profile immediately and update context + localStorage
      const profile = await getProfile();
      setUser(profile.user);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      setServerError(
        err.response?.data?.message ||
          (err.response?.data as unknown as { error: string }).error ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto space-y-4 p-4 bg-card rounded-xl shadow-md"
    >
      <h2 className="text-center text-xl font-bold">🔑 Sign In</h2>

      {/* Backend error */}
      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <div>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Password with toggle */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <Button disabled={isSubmitting} type="submit" className="w-full">
        🚀 Login
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
