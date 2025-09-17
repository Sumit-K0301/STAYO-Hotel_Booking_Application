import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
    const { showToast } = useAppContext()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn : apiClient.signOut,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey : ["validateToken"]})
            showToast({
                message: "Sign Out..!",
                type: "SUCCESS"
            })
            navigate("/")
        },
        onError: (error: Error ) => {
            showToast({
                message: error.message,
                type: "ERROR"
            })
        }
       })

       const handleSignOut = () => {
        mutation.mutate()
       }

    return(
        <>
        <button onClick = {handleSignOut} className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-blue-100">Sign Out</button>
        </>
    )
}

export default SignOutButton