import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setTokens } from "@/services/authTokens";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { signup } from "@/services/api/auth.api";

const signupSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  firstName: z.string().min(2, { message: "First name too short" }),
  lastName: z.string().min(2, { message: "Last name too short" }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});
type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    const res = await signup(data);
    setTokens(res);
    login();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto space-y-4 p-4 bg-card rounded-xl shadow-md"
    >
      <h2 className="text-center text-xl font-bold">📝 Sign Up</h2>

      <div>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div>
        <Input placeholder="First Name" {...register("firstName")} />
        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
      </div>

      <div>
        <Input placeholder="Last Name" {...register("lastName")} />
        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
      </div>

      <div>
        <Input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      <Button disabled={isSubmitting} type="submit" className="w-full">
        🚀 Register
      </Button>

      {/* 🔹 Prompt section */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
