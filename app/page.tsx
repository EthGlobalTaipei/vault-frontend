import Link from "next/link"
import { Button } from "@/components/ui/button"
import "@/app/globals.css"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-5xl mt-20 mb-32 text-center relative">
        {/* Background decoration */}
        <div className="absolute -z-10 inset-0 -top-40 flex justify-center">
          <div className="w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-8 font-heading">
          <span className="gradient-text">THE DEFI WAY</span> TO EARN ON CRYPTO
        </h1>
        <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
          ChatDeFi is DeFi&apos;s first AI-powered strategy builder and manager.
          Maximize your earnings with intelligent automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="animated-button bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
            <Link href="/strategies">DISCOVER STRATEGIES</Link>
          </Button>
          <Button asChild variant="outline" className="animated-button gradient-border px-8 py-6 text-lg">
            <Link href="/create-strategies">CREATE YOUR OWN</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full mb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center font-heading">
          THERE ARE <span className="gradient-text">LOADS OF WAYS</span> TO EARN, WITH CHATDEFI!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          <div className="glass-card rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">AUTOMATED YIELD STRATEGIES</h3>
            <p className="text-foreground/80">
              The DeFi economy offers loads of ways to earn yield on your capital. ChatDeFi Strategies automatically take
              advantage of these opportunities to give you the best risk-adjusted yields.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI ASSISTED STRATEGIES</h3>
            <p className="text-foreground/80">
              Our AI assistant helps you find the best strategies for your portfolio, optimizing returns based on your risk tolerance and investment goals.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">SECURITY FOCUSED</h3>
            <p className="text-foreground/80">
              All strategies undergo rigorous security audits and testing to ensure your funds are safe and protected at all times.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="w-full max-w-5xl mb-16 py-16 px-6 glass-card rounded-2xl relative overflow-hidden">
        <div className="absolute -z-10 right-0 top-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] opacity-30"></div>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to start earning?</h2>
          <p className="text-xl text-foreground/80 mb-8">
            Join thousands of investors already using our platform to maximize their DeFi yields.
          </p>
          <Button asChild className="animated-button bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
            <Link href="/strategies">GET STARTED NOW</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

