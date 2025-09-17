import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form"
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
    email : string;
    password : string;
}

const SignIn = () => {
    const {register, handleSubmit, formState : {errors}} = useForm<SignInFormData>()

    const navigate = useNavigate()
    const location = useLocation()
    
    const { showToast } = useAppContext()

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn : apiClient.signIn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey : ["validateToken"]})

            showToast({
                message: "Logged In..!",
                type: "SUCCESS"
            })
            navigate(location?.state?.from?.pathname || "/")
        },
        onError: (error: Error ) => {
            showToast({
                message: error.message,
                type: "ERROR"
            })
        }
       })

       const onSubmit = handleSubmit((data) => {
            mutation.mutate(data)

       })

    return(
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>

             <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input className="border rounded w-full py-1 px-2 font-normal" type = "email" {...register("email", {
                    required : "This field is required."
                })}></input>
                {errors.email &&(<span className="text-red-500">{errors.email.message}</span>)}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input className="border rounded w-full py-1 px-2 font-normal" type = "password" {...register("password", {
                    required : "This field is required.",
                    minLength : {
                        value : 6,
                        message : "Password must be of atleast 6 characters"
                    }
                })}></input>
                {errors.password &&(<span className="text-red-500">{errors.password.message}</span>)}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm ">Not Registered?<Link to = "/register" className="underline font-semibold"> Click here to register</Link></span>
                <button className = "bg-blue-600 text-white p-2 font-bold hover:bg-blue-400 text-xl" type = "submit">
                    Log In
                </button>
            </span>

        </form>


    )

}

export default SignIn;