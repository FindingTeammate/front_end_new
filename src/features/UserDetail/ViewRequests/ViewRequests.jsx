import { Loader, Alert, Button } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../AuthProvider";
import dayjs from "dayjs";
import { IconMoodEmpty } from "@tabler/icons";
import styles from "../userdetail.module.scss";

const getRequests = async (accessToken) => {
  const response = await fetch(
    "https://ftm.pythonanywhere.com/api/friends/requests/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
};

const ViewRequests = () => {
  const [{ access: accessToken }] = useAuthContext();
  const { data, isLoading, refetch } = useQuery(["view-requests"], () =>
    getRequests(accessToken)
  );

  const mutation = useMutation(async (senderId) => {
    const response = await fetch(
      "https://ftm.pythonanywhere.com/api/friends/accept_request/",
      {
        method: "POST",
        body: senderId,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return await response.json();
  });

  const onAcceptRequest = (senderId) => {
    const formData = new FormData();

    formData.append("id", senderId);
    mutation.mutate(formData, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (isLoading) {
    return (
      <div className={styles["loader-container"]}>
        <Loader variant="bars" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Alert icon={<IconMoodEmpty size={36} />} title="Bummer!" color="teal">
        No new requests received.
      </Alert>
    );
  }

  return (
    <div>
      {data?.map((request, index) => (
        <div className={styles["single-request"]} key={index}>
          <p>
            <span>Request from : </span> {request.from_user}
          </p>
          <p>
            <span>Message : </span> {request.message || ""}
          </p>
          <p>
            <span>Request sent at : </span>
            {dayjs(request.created).format("D MMM YYYY")}
          </p>
          <Button
            variant="gradient"
            onClick={() => onAcceptRequest(request.id)}
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Accept
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ViewRequests;
