import { Scanner } from "@yudiel/react-qr-scanner";
import { App, Card, Spin, Modal, InputNumber, Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FETCH_USER_BY_MID } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import AvatarCell from "../../components/common/AvatarCell";

const EventMidScanner = ({
  eventId,
  setOpenQrDialog,
  scanning,
  NoofMember,
  setMultiMemberModal,
  multiMemberModal,
  onCheckInSuccess,
  checkedInMembers = [],
}) => {
  const { message } = App.useApp();
  const [scanResult, setScanResult] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [midValueState, setMidValueState] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const timeoutRef = useRef(null);
  const { trigger: fetchUserTrigger, loading: fetchLoading } = useApiMutation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const submitEvent = async (midValue, count) => {
    try {
      if (onCheckInSuccess && scannedUser) {
        onCheckInSuccess({
          ...scannedUser,
          checkInTime: dayjs().format("HH:mm:ss"),
          peopleCount: count,
        });
        message.success("Check-in successful!");
      }
    } catch (error) {
      message.error("Error updating check-in list.");
    }
  };

  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      setScanResult(scannedValue);
      console.log("QR Scanned Value:", scannedValue); // Logging for debugging

      let midValue = null;
      if (scannedValue.includes("mid=")) {
        const midMatch = scannedValue.match(/mid=([^&\s]+)/);
        midValue = midMatch ? midMatch[1] : null;
      } else if (
        /^[a-zA-Z0-9]+$/.test(scannedValue) &&
        scannedValue.length <= 15
      ) {
        // If it's a simple alphanumeric string, assume it's the MID
        midValue = scannedValue;
      } else {
        // Try extracting from URL path if it looks like one
        try {
          if (scannedValue.startsWith("http")) {
            const url = new URL(scannedValue);
            const pathParts = url.pathname.split("/").filter(Boolean);
            midValue = pathParts[pathParts.length - 1];
          }
        } catch (e) {}
      }

      if (!midValue) {
        message.error(`Invalid QR format: "${scannedValue}"`);
        return;
      }

      // Early Duplicate Check
      const isDuplicate = checkedInMembers.some((m) => m.user_mid === midValue);
      if (isDuplicate) {
        message.error(
          `Duplicate Scan: Member with MID ${midValue} is already checked in!`,
        );
        return;
      }

      try {
        const userRes = await fetchUserTrigger({
          url: FETCH_USER_BY_MID(midValue),
          method: "get",
        });

        if (userRes.data) {
          const userData = userRes.data;
          const imageUrlConfigs = userRes.image_url || [];

          const userImageConfig = imageUrlConfigs.find(
            (config) => config.image_for === "User",
          );
          const noImageConfig = imageUrlConfigs.find(
            (config) => config.image_for === "No Image",
          );

          const baseImageUrl = userImageConfig ? userImageConfig.image_url : "";
          const noImageUrl = noImageConfig ? noImageConfig.image_url : "";

          setScannedUser({
            ...userData,
            full_image: userData.user_image
              ? `${baseImageUrl}${userData.user_image}`
              : noImageUrl,
          });
          setMidValueState(midValue);
          setUserDetailsModal(true);
        } else {
          message.error(`Member with MID "${midValue}" not found.`);
        }
      } catch (error) {
        message.error("Error fetching member details.");
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setScanResult("");
      }, 3000);
    }
  };

  const handleError = (err) => {
    console.error("Scan error:", err);
    message.error("Error scanning QR code");
  };

  const isSecure =
    window.isSecureContext ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {!isSecure && (
        <div
          className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span className="font-medium">Warning!</span> Camera access requires
          HTTPS. Please access the site via a secure connection.
        </div>
      )}

      <div className="relative w-full max-w-[300px] h-full overflow-hidden rounded-xl border-2 border-primary/20 bg-black/5 shadow-inner">
        {scanning ? (
          <div className="relative aspect-square w-full">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              className="scanner"
              styles={{
                container: { width: "100%", height: "100%" },
                video: { width: "100%", height: "100%", objectFit: "cover" },
              }}
            />
            {/* Optional: Add a subtle scanning animation overlay here if desired */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/50 animate-pulse hidden group-hover:block"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground italic">
            Scanner is paused.
          </div>
        )}
      </div>

      {/* User Details & Confirmation Modal */}
      <Modal
        open={userDetailsModal}
        title="Member Details"
        onCancel={() => setUserDetailsModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setUserDetailsModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (NoofMember === "One Card Multi Member") {
                setMultiMemberModal(true);
                setUserDetailsModal(false);
              } else {
                submitEvent(midValueState, 1);
                setUserDetailsModal(false);
              }
            }}
          >
            Check-in
          </Button>,
        ]}
      >
        {scannedUser && (
          <div className="flex flex-col items-center gap-4 py-4">
            <AvatarCell src={scannedUser.full_image} size={100} />
            <div className="text-center">
              <h3 className="text-xl font-bold">{scannedUser.name}</h3>
              <p className="text-gray-500">MID: {scannedUser.user_mid}</p>
              {(scannedUser.user_mobile ||
                scannedUser.mobile_no ||
                scannedUser.mobile) && (
                <p className="text-gray-500">Phone: {scannedUser.mobile}</p>
              )}
              {scannedUser.user_member_type && (
                <p className="text-sm font-medium text-primary mt-1">
                  {scannedUser.user_member_type}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Multi Member Input Modal */}
      <Modal
        open={multiMemberModal}
        title="Enter Number of People"
        onCancel={() => setMultiMemberModal(false)}
        footer={null}
      >
        <InputNumber
          min={1}
          max={20}
          value={peopleCount}
          onChange={(val) => setPeopleCount(val)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <Button
          type="primary"
          block
          onClick={() => {
            submitEvent(midValueState, peopleCount);
            setMultiMemberModal(false);
          }}
        >
          Submit
        </Button>
      </Modal>
    </div>
  );
};

export default EventMidScanner;
