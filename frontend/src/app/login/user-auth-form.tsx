"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/lib/auth";
import { useDispatch } from "react-redux";
import { loginFailure } from "@/lib/actions/authActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setAccessToken } from "@/lib/slices/authSlice";
import { Loader2 } from "lucide-react"; // Import loading spinner icon

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, startTransition] = useTransition();
  const dispatch = useDispatch();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const response = await fetch("http://localhost:3001/dev/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const result = await response.json();

        if (response.status === 200) {
          dispatch(setAccessToken(result.accessToken));
          toast.success("Signed in successfully!");
          router.push("/dashboard");
        } else {
          dispatch(loginFailure(result.message || "An error occurred"));
          toast.error(result.message || "An error occurred");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
        logout();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<Button
  disabled={loading}
  className="w-[200px] bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2 ml-0"
  type="submit"
>
  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
  {loading ? "Logging in..." : "Login"}
</Button>

      </form>
    </Form>
  );
}
