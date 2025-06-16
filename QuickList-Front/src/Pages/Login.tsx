import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/Components/ui/form";
import { Card, CardContent } from "@/Components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { login } from "@/Service/http";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters",
  }),
});
const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await login(values.username, values.password);
      setAccessToken(res.access_token);
      navigate("/");
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardContent>
          <p className="text-2xl text-center">Sign in</p>
          <p className="text-gray-500 text-center mt-2">
            Welcome user, please sign in to continue
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full max-w-sm items-center gap-3 mt-4">
                    <Label htmlFor="email" className="text-md">
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-2"
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full max-w-sm items-center gap-3 mt-4">
                    <Label htmlFor="password" className="text-md">
                      Password
                    </Label>
                    <FormControl>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        className="focus-visible:ring-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="mt-8 w-full flex items-center justify-center">
                <Button className="hover:bg-primary/70">Click</Button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex">
                <Label className="text-md mt-5">Don't have an account?</Label>
                <Link to="/signup">
                  <Button variant="link" className="text-md mt-5 w-0.2">
                    Sign up
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
