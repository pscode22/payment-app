import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login as loginApi } from "@/services/api/auth.api";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { setTokens } from "@/services/authTokens";

const signinSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});
type SigninForm = z.infer<typeof signinSchema>;

export default function Signin() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninForm) => {
    const res = await loginApi(data.email, data.password);
    setTokens(res);
    login();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto space-y-4 p-4 bg-card rounded-xl shadow-md"
    >
      <h2 className="text-center text-xl font-bold">🔑 Sign In</h2>

      <div>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <Button disabled={isSubmitting} type="submit" className="w-full">
        🚀 Login
      </Button>

      {/* 🔹 Prompt section */}
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
