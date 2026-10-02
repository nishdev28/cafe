import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Subscribe() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="bg-purple flex flex-wrap items-center justify-between gap-5 rounded-3xl p-5  sm:p-8">
      <div className="max-w-xs flex-1 sm:text-xl">
        <h5>Subscribe to the latest</h5>
        <p>from Hearth & Grind</p>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center">
            <input
              {...register("email")}
              placeholder="Your Email"
              className="h-10 rounded-l-sm rounded-r-none border-b px-2  focus:outline-0 sm:text-lg md:h-[50px]"
            />
            <button
              type="submit"
              className="h-10 cursor-pointer rounded-l-none rounded-r-sm border-b px-4  sm:text-lg md:h-[50px]"
            >
              Subscribe
            </button>
          </div>
          {errors.email && (
            <p className="mt-4 text-red-500">{errors.email.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
