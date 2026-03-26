import { Card } from "antd";
import { useState } from "react";
import EventMidScanner from "../eventtrack/EventTrackerQR";

const EventScannerPage = () => {
  const [multiMemberModal, setMultiMemberModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card 
        className="overflow-hidden shadow-2xl border-none bg-white/80 backdrop-blur-md rounded-3xl"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-gradient-to-r from-primary/10 via-background to-primary/10 p-4 md:p-8 text-center border-b border-primary/10">
          <h2 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Digital Entry Point
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Scan member QR codes for ultra-fast validation and automated check-in.
          </p>
        </div>
        
        <div className="p-4 md:p-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col items-center justify-center p-4 md:p-8 bg-card rounded-2xl border border-primary/10 min-h-[450px] shadow-inner">
              <EventMidScanner
                scanning={true}
                NoofMember="One Card One Member"
                setMultiMemberModal={setMultiMemberModal}
                multiMemberModal={multiMemberModal}
                setOpenQrDialog={() => {}} 
              />
            </div>
          </div>

          <div className="mt-6 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", label: "Scan QR", desc: "Align code in viewfinder" },
              { step: "02", label: "Verify", desc: "Check member credentials" },
              { step: "03", label: "Check-in", desc: "Instant log synchronization" }
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors group">
                <span className="absolute top-4 right-4 text-4xl font-black text-primary/5 opacity-20 group-hover:opacity-40 transition-opacity">
                  {item.step}
                </span>
                <h4 className="text-xl font-bold mb-1">{item.label}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventScannerPage;
