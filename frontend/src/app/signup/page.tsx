import AuthForm from "@/components/common/AuthForm";

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 w-full flex justify-center">
                <AuthForm type="signup" />
            </div>
        </main>
    );
}
