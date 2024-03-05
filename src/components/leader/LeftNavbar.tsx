import { CusLink } from "@/utils/CusLink";
import { FC, ReactNode, useEffect, useState } from "react";
import { LEFT_NAV_ROUTES } from "@/utils/routes";
import { MdSpaceDashboard } from "react-icons/md";
import { fetchAccessTabs } from "../api/tabsAccess";
import { RootState } from "@/redux_store";
import { cusSelector } from "@/redux_store/cusHooks";
import { UserData } from "@/utils/utility";
import { getCookie } from "cookies-next";
import { USER_TYPE } from "@/constants/common";

const LeftNavLink: FC<{
  children: ReactNode;
  link: string;
  info: string;
  target?: boolean;
  routeData: any[];
}> = ({ children, link, info, target, routeData }) => {
  const matchedData = routeData.some((item) => item.tabname == info);

  return (
    <CusLink
      activeLinkClasses="bg-sky-950 text-sky-50"
      normalClasses="text-sky-950 bg-sky-100"
      href={matchedData ? link : link}
      target={target}
      className="rounded-full w-12 aspect-square flex items-center justify-center text-2xl relative cus_link"
    >
      {children}

      <span className="hover_text z-[120]">
        <span className="triangle" />
        {info}
      </span>
    </CusLink>
  );
};

export const LeftNavbar: FC = () => {
  const { userDetails } = cusSelector((state) => state.auth);
  let user_type = getCookie(USER_TYPE)
  const [routeData, setRouteData] = useState([]);

  useEffect(() => {
    const userid = userDetails?.id;
    if (userid) {
      (async () => {
        const data = await fetchAccessTabs(userid);
        if (data?.length > 0) {
          setRouteData(data);
        }
      })();
    }
  }, [userDetails]);

  return (
    <section className="py-8 px-3 bg-white flex flex-col shadow_left gap-5 h-full max-[1000px]:hidden">
      {LEFT_NAV_ROUTES.map((El) => (
        <LeftNavLink
          key={El.id}
          info={El.name}
          link={El.link}
          routeData={routeData}
        >
          {<El.Icon />}
        </LeftNavLink>
      ))}
      {/* <LeftNavLink
        info={"dashboard"}
        link={"/"}
        target
        routeData={routeData}
      >
        <MdSpaceDashboard />
      </LeftNavLink> */}

    </section>
  );
};
