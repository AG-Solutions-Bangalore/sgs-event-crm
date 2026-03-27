import { Card, List, Avatar, Tag, Button, App } from "antd";
import { useState } from "react";
import EventMidScanner from "../eventtrack/EventTrackerQR";
import { User, Clock, Users, Trash2 } from "lucide-react";

const EventScannerPage = () => {
  const { message } = App.useApp();
  const [multiMemberModal, setMultiMemberModal] = useState(false);
  const [checkedInMembers, setCheckedInMembers] = useState([]);

  const handleCheckInSuccess = (member) => {
    setCheckedInMembers((prev) => [member, ...prev]);
  };

  const clearList = () => {
    setCheckedInMembers([]);
    message.success("Check-in list cleared.");
  };

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-5 xl:flex xl:items-start xl:gap-6 space-y-4 xl:space-y-0">
      <div className="xl:flex-1 xl:max-w-xl">
        <Card
          className="overflow-hidden shadow-2xl border-none bg-white/80 backdrop-blur-md rounded-3xl"
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-gradient-to-r from-primary/10 via-background to-primary/10 p-2 md:p-4 text-center border-b border-primary/10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Event Check-in Scanner
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Scan member QR codes.
            </p>
          </div>

          <div className="p-3 md:p-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col items-center justify-center p-4 bg-card rounded-2xl border border-primary/10 min-h-[350px] shadow-inner">
                <EventMidScanner
                  scanning={true}
                  NoofMember="One Card One Member"
                  setMultiMemberModal={setMultiMemberModal}
                  multiMemberModal={multiMemberModal}
                  setOpenQrDialog={() => {}}
                  onCheckInSuccess={handleCheckInSuccess}
                  checkedInMembers={checkedInMembers}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="xl:flex-1">
        {/* Checked-in Members List */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Users size={20} className="text-primary" />{" "}
              <span>Recent Check-ins</span>
            </div>
          }
          extra={
            checkedInMembers.length > 0 && (
              <Button 
                type="text" 
                danger 
                icon={<Trash2 size={16} />} 
                onClick={clearList}
                className="flex items-center gap-1"
              >
                Clear
              </Button>
            )
          }
          className="shadow-xl border-none bg-white/80 backdrop-blur-md rounded-3xl"
        >
          {checkedInMembers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground italic">
              No check-ins yet.
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={checkedInMembers}
              renderItem={(member, index) => (
                <List.Item className="border-b last:border-0 border-gray-100 dark:border-gray-800 py-4">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={member.full_image}
                        size={48}
                        icon={<User />}
                        className="border-2 border-primary/20"
                      />
                    }
                    title={
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold">{member.name}</span>
                        <Tag
                          color="green"
                          icon={<Clock size={12} className="inline mr-1" />}
                        >
                          {member.checkInTime}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">
                          MID: {member.user_mid}
                        </span>
                        {member.peopleCount > 1 && (
                          <Tag color="blue" size="small" className="w-fit">
                            {member.peopleCount} People
                          </Tag>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default EventScannerPage;
