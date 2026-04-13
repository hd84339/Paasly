import AuthForm from "@/components/common/AuthForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#fafafa]">
            {/* Soft Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            
            {/* Advanced Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[120px] mix-blend-multiply pointer-events-none -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[150px] mix-blend-multiply pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 w-full flex justify-center p-4">
                <AuthForm type="login" />
            </div>
        </main>
    );
}
