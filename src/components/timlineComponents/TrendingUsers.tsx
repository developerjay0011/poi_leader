"use client";

import { CommonBox } from "@/utils/CommonBox";
import { user2Img } from "@/utils/utility";
import Image, { StaticImageData } from "next/image";
import { FC, useEffect, useState } from "react";
import ARVIND from "@/assets/politicians-images/ARVIND_KEJRIWAL.jpg";
import MODI from "@/assets/politicians-images/narendar_modi.jpg";
import RAHUL from "@/assets/politicians-images/Rahul-Gandhi.jpg";
import {
  fetchFollowLeader,
  fetchTrendingLeaderList,
} from "../api/followLeader";
import { cusSelector } from "@/redux_store/cusHooks";
import { RootState } from "@/redux_store";
interface Leader {
  image: string;
  designation: string;
  username: string;
  id: string;
}

interface TrendingUsersProps {
  handleFollowers: any;
}
export const TrendingUsers: FC<TrendingUsersProps> = ({ handleFollowers }) => {
  const [trendingLeaders, setTrendingLeaders] = useState([]);
  const userDetails: any = cusSelector(
    (state: RootState) => state.auth.userDetails
  );

  console.log(trendingLeaders);

  console.log(userDetails);

  useEffect(() => {
    if (userDetails && userDetails?.success) {
      (async () => {
        const token = userDetails?.token;
        const data = await fetchTrendingLeaderList(token);
        console.log(data);

        if (data.length > 0) {
          setTrendingLeaders(data);
          handleFollowers(data);
        }
      })();
    }
  }, [userDetails]);

  const following = (data: any) => {
    handleFollowers(data);
  };

  return (
    <>
      <section
        className={`border rounded-md w-full bg-white text-sky-950 max-h-[25rem] overflow-hidden flex flex-col`}
      >
        <h2 className="flex items-center after:h-1/2 after:w-[3px] after:bg-orange-600 after:rounded-full after:absolute after:top-1/2 after:translate-y-[-50%] after:left-0 relative px-6 py-3 border-b font-[500] text-[16px] capitalize">
          Trending Leaders
        </h2>

        <div className="overflow-y-scroll flex-1 main_scrollbar">
          <ul className="flex flex-col">
            {/* <TrendingUser
              userImg={MODI}
              designation="prime minister"
              username="narendar modi"
              id=""
              following={following}
            />
            <TrendingUser
              userImg={RAHUL}
              designation=" chairperson of the Indian Youth Congress"
              username="rahul gandhi"
              id=""
              following={following}
            /> */}
            {trendingLeaders?.length > 0 &&
              trendingLeaders?.map((item: Leader, index: number) => {
                return (
                  <TrendingUser
                    userImg={item?.image || ""}
                    designation={item?.designation || ""}
                    username={item?.username || ""}
                    id={item?.id || ""}
                    key={index}
                    following={following}
                  />
                );
              })}
          </ul>
        </div>
      </section>
    </>
  );
};
interface TrendingUserProps {
  designation: string;
  username: string;
  userImg: string | StaticImageData;
  id: string;
  following: any;
}

const TrendingUser: FC<TrendingUserProps> = ({
  userImg,
  designation,
  username,
  id,
  following,
}) => {
  const userDetails: any = cusSelector(
    (state: RootState) => state.auth.userDetails
  );

  const handleFollower = async (id: string) => {
    const token = userDetails?.token;
    const postBody = {
      senderid: userDetails?.data?.leader_detail?.id,
      receiverid: id,
    };

    const followedLeader = await fetchFollowLeader(postBody, token);

    console.log(followedLeader);

    if (followedLeader?.success) {
      following(followedLeader);
    }
  };

  return (
    <li className="flex gap-3 py-3 px-3 last_noti items-center">
      <Image
        src={userImg}
        alt="trending user"
        width={1000}
        height={1000}
        className="rounded-full w-12 aspect-square object-cover object-center"
      />

      <div className="flex flex-col">
        <h3 className="text-[14px] font-semibold capitalize">{username}</h3>
        <p className="text-[12px] capitalize">{designation}</p>
      </div>

      <button
        type="button"
        className="text-orange-500 hover:underline ml-auto text-[15px]"
        onClick={() => handleFollower(id)}
      >
        Follow
      </button>
    </li>
  );
};
