import { z } from "zod";

// creating a schema for strings
const mySchema = z.string();

// parsing
mySchema.parse("tuna"); // => "tuna"

// try {
//   mySchema.parse(12); // => throws ZodError
// } catch (e) {
//   console.warn('Zod error', e);
// }

// "safe" parsing (doesn't throw error if validation fails)
mySchema.safeParse("tuna"); // => { success: true; data: "tuna" }
mySchema.safeParse(12); // => { success: false; error: ZodError }

const User = z.object({
  name: z.string(),
  email: z.string().email(),
});

// throw success is false due to invalid email
console.log(User.safeParse({ name: "Ludwig", email: "andrei" }));

// extract the inferred type
type User = z.infer<typeof User>;

// How can I use Zod for forms?

const password = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(5, { message: "Must be 5 or more characters long" });

let passwordCheck = password.safeParse("12");
if (!passwordCheck.success) {
  console.log(passwordCheck.error);
}

/*
  * Example of parsing Remix actions with Zod:
  *
  *
  * 
  *

  export const action: ActionFunction = async ({request}) => {
  const formPayload = Object.fromEntries(await request.formData())
  const subscriberSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })
  try {
    const newSubscriber = subscriberSchema.parse(formPayload)
    // subscribe them to a newsletter or whatever
    return redirect(`/confirmed`)
  } catch (error) {
    console.error(`form not submitted ${error}`)
    return json({ error });
  }
}
  * */





// Advanced example of a form:
const formSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

type FormSchemaType = z.infer<typeof formSchema>;
// react-hook-form integrates well with Zop (See
// https://github.com/Diegoav87/react-form-validation/blob/2eb45980c7cb3f35cd9b9eab856d2091818e2f58/src/App.tsx#L26-L32)


