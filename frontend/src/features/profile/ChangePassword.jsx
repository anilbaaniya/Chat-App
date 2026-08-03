import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getCurrentUser, updatePassword } from "../../redux/auth/authSlice";

export default function ChangePassword({ setChanging }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await dispatch(
        updatePassword({
          currentPassword: data.currentPassword,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      ).unwrap();
      // refresh current user
      await dispatch(getCurrentUser()).unwrap();
      toast.success("Password updated successfully");
      setChanging(false);
      reset();
    } catch (err) {
      console.error(err);
      toast.error(err || "Failed to update password");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 ml-5 my-5 w-60"
    >
      <div>
        <p className="text-lg font-semibold mb-4 bg-stone-200 px-4 py-2 rounded-lg">
          Change Your Password
        </p>
        <label htmlFor="name">Current Password</label>
        <input
          type="password"
          {...register("currentPassword", {
            required: "Current password is required.",
          })}
          className="w-full border border-gray-300 rounded-lg px-4 py-1 text-black bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="name">New Password</label>
        <input
          type="password"
          {...register("password", {
            required: "New password is required.",
          })}
          className="w-full border border-gray-300 rounded-lg px-4 py-1 text-black bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="name">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Confirm password is required.",
          })}
          className="w-full border border-gray-300 rounded-lg px-4 py-1 text-black bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setChanging(false)}
          type="button"
          className="border-2 border-stone-200 rounded-xl px-4 py-2 bg-stone-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className=" rounded-xl px-4 py-2 bg-blue-700 text-white cursor-pointer"
        >
          Update
        </button>
      </div>
    </form>
  );
}
