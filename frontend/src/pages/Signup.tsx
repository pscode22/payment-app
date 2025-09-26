import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setTokens } from "@/services/authTokens";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { signup } from "@/services/api/auth.api";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";
import { getProfile } from "@/services/api/user.api";
import { useUser } from "@/context/UserContext";

const signupSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  firstName: z.string().min(2, { message: "First name too short" }),
  lastName: z.string().min(2, { message: "Last name too short" }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});
type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const { login } = useAuth();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setServerError(null);
      const res = await signup(data);
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
      <h2 className="text-center text-xl font-bold">📝 Sign Up</h2>

      {/* Backend error */}
      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <div>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="First Name" {...register("firstName")} />
        {errors.firstName && (
          <p className="text-red-500 text-xs">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Last Name" {...register("lastName")} />
        {errors.lastName && (
          <p className="text-red-500 text-xs">{errors.lastName.message}</p>
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
        🚀 Register
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
