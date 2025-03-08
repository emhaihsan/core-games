import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to <span className="text-[#ff6b00]">Classic</span>Game<span className="text-[#ffa500]">Hub</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Play classic games and record your high scores on the blockchain!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="web3-card p-8 hover:border-[#ff6b00]/50">
              <div className="h-16 w-16 bg-[#ff6b00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image 
                  src="/wallet.svg" 
                  alt="Wallet" 
                  width={40} 
                  height={40} 
                  className="text-[#ff6b00]"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#ff6b00]">Connect Your Wallet</h2>
              <p className="mb-4 text-gray-300">Use the connect button in the header to get started</p>
            </div>
            
            <div className="web3-card p-8 hover:border-[#ff6b00]/50">
              <div className="h-16 w-16 bg-[#ff6b00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image 
                  src="/controller.svg" 
                  alt="Game Controller" 
                  width={40} 
                  height={40} 
                  className="text-[#ff6b00]"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#ff6b00]">Play Games</h2>
              <p className="mb-4 text-gray-300">Access a variety of classic games</p>
            </div>
            
            <div className="web3-card p-8 hover:border-[#ff6b00]/50">
              <div className="h-16 w-16 bg-[#ff6b00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image 
                  src="/trophy.svg" 
                  alt="Trophy" 
                  width={40} 
                  height={40} 
                  className="text-[#ff6b00]"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#ff6b00]">Record High Scores</h2>
              <p className="mb-4 text-gray-300">Your achievements are stored on the blockchain</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-[#ff6b00]/20">
        <p> {new Date().getFullYear()} Classic Game Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
