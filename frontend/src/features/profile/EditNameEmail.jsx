import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/user/userSlice";
import { getCurrentUser } from "../../redux/auth/authSlice";

export default function EditNameEmail({ setEditing, user }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  async function onSubmit(formData) {
    try {
      // wait for thunk to complete and throw on error
      await dispatch(updateUserProfile(formData)).unwrap();
      // refresh current user from server to ensure auth state stays correct
      await dispatch(getCurrentUser()).unwrap();
      toast.success("Profile edited successfully!");
      setEditing(false);
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 mx-6 my-4 w-100 bg-white p-6 rounded-2xl "
    >
      <p className="text-lg font-semibold underline underline-offset-4">
        Edit your profile
      </p>
      <div className="flex flex-col gap-2 ">
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <input
          {...register("name", {
            required: "Name is required.",
          })}
          className="w-full border bg-stone-100 border-gray-300 rounded-lg px-4 py-1 text-black  focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input
          {...register("email", {
            required: "Email is required.",
          })}
          className="w-full border bg-stone-100 border-gray-300 rounded-lg px-4 py-1 text-black  focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="flex gap-6 mt-4">
        <button
          onClick={() => setEditing(false)}
          className="bg-stone-100 border border-stone-300 rounded-xl px-4 py-1 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className=" rounded-xl px-4 py-1 bg-blue-700 text-white cursor-pointer"
        >
          Update
        </button>
      </div>
    </form>
  );
}
