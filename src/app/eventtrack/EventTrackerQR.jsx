import { Scanner } from "@yudiel/react-qr-scanner";
import { App, Card, Spin, Modal, InputNumber, Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FETCH_USER_BY_MID, EVENT_TRACK } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import AvatarCell from "../../components/common/AvatarCell";

const EventMidScanner = ({
  eventId,
  setOpenQrDialog,
  scanning,
  NoofMember,
  setMultiMemberModal,
  multiMemberModal,
}) => {
  const { message } = App.useApp();
  const [scanResult, setScanResult] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [midValueState, setMidValueState] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const timeoutRef = useRef(null);
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const { trigger: fetchUserTrigger, loading: fetchLoading } = useApiMutation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const submitEvent = async (midValue, count) => {
    const payload = {
      event_no_of_people: count,
      event_id: eventId || 1,
      event_member_mid: midValue,
      event_entry_date: dayjs().format("YYYY-MM-DD"),
    };

    try {
      const res = await submitTrigger({
        url: EVENT_TRACK,
        method: "post",
        data: payload,
      });

      if (res.code === 201) {
        message.success(res.message || "Event saved!");
        // setOpenQrDialog(false);
      } else {
        message.error(res.message || "Failed to save event.");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Error submitting event."
      );
      console.error(error);
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
      } else if (/^[a-zA-Z0-9]+$/.test(scannedValue) && scannedValue.length <= 15) {
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

      try {
        const userRes = await fetchUserTrigger({
          url: FETCH_USER_BY_MID(midValue),
          method: "get",
        });

        if (userRes.data) {
          const userData = userRes.data;
          const imageUrlConfigs = userRes.image_url || [];
          
          const userImageConfig = imageUrlConfigs.find(
            (config) => config.image_for === "User"
          );
          const noImageConfig = imageUrlConfigs.find(
            (config) => config.image_for === "No Image"
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

  return (
    <>
      {submitLoading ? (
        <Card
          style={{
            maxWidth: 400,
            minHeight: 260,
            margin: "20px auto",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </Card>
      ) : (
        <>
          {scanning && (
            <Scanner
              onScan={handleScan}
              onError={handleError}
              className="scanner"
              styles={{
                container: { width: "100%", maxWidth: "400px", margin: "auto" },
                video: { width: "100%", height: "auto" },
              }}
            />
          )}
        </>
      )}

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
            loading={submitLoading}
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
            Confirm Check-in
          </Button>,
        ]}
      >
        {scannedUser && (
          <div className="flex flex-col items-center gap-4 py-4">
            <AvatarCell
              src={scannedUser.full_image}
              size={100}
            />
            <div className="text-center">
              <h3 className="text-xl font-bold">{scannedUser.name}</h3>
              <p className="text-gray-500">MID: {scannedUser.user_mid}</p>
              {scannedUser.user_member_type && (
                <p className="text-sm font-medium text-primary">
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
    </>
  );
};

export default EventMidScanner;
