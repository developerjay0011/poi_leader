import Axios from "@/config/axios";
import { tryCatch } from "@/config/try-catch";
import { APIRoutes } from "@/constants/routes";
import moment from "moment";

// Create / Update Leader API
export const submitLeaderForm = async (body: any) => {
  return tryCatch(
    async () => {
      var personal_info = body?.personal_info
      var contact_info = body?.contact_info
      var political_info = body?.political_info
      var general_setting = body?.general_setting
      var activity_pictures = Array(political_info?.activity_pictures) ? political_info?.activity_pictures : []
      var params = {
        "id": body?.id,
        "username": body?.username,
        "email": body?.email,
        "mobile": body?.mobile,
        "leadertype": body?.leadertype,
        "password": '',
        "request_status": body?.request_status,
        "isactive": body?.isactive,
        'about_me': body?.about_me,
        "is_profile_complete": body?.is_profile_complete,
        "created_date": body?.created_date ? body?.created_date : moment(),
        "modified_date": body?.modified_date ? body?.modified_date : moment(),
        "personal_info": {
          "first_name": personal_info?.first_name ? personal_info?.first_name : "",
          "middle_name": personal_info?.middle_name ? personal_info?.middle_name : "",
          "last_name": personal_info?.last_name ? personal_info?.last_name : "",
          "gender": personal_info?.gender ? personal_info?.gender : "",
          "blood_group": personal_info?.blood_group ? personal_info?.blood_group : "",
          "father_name": personal_info?.father_name ? personal_info?.father_name : "",
          "mother_name": personal_info?.mother_name ? personal_info?.mother_name : "",
          "dob": personal_info?.dob ? personal_info?.dob : "",
          "place_of_birth": personal_info?.place_of_birth ? personal_info?.place_of_birth : "",
          "marital_status": personal_info?.marital_status ? personal_info?.marital_status : "",
          "spouse_name": personal_info?.spouse_name ? personal_info?.spouse_name : "",
          "no_of_daughters": personal_info?.no_of_daughters ? personal_info?.no_of_daughters : 0,
          "no_of_sons": personal_info?.no_of_sons ? personal_info?.no_of_sons : 0,
          "higher_education": personal_info?.higher_education ? personal_info?.higher_education : "",
          "profession": personal_info?.profession ? personal_info?.profession : "",
          "hobbies": personal_info?.hobbies ? personal_info?.hobbies : "",
          "assets": personal_info?.assets ? personal_info?.assets : "",
        },
        "contact_info": {
          "permanent_address": contact_info?.permanent_address ? contact_info?.permanent_address : "",
          "permanent_state_id": contact_info?.permanent_state_id ? contact_info?.permanent_state_id : "",
          "permanent_district_id": contact_info?.permanent_district_id ? contact_info?.permanent_district_id : "",
          "permanent_pincode": contact_info?.permanent_pincode ? contact_info?.permanent_pincode : "",
          "is_same_as_permanent": typeof contact_info?.is_same_as_permanent == "boolean" ? contact_info?.is_same_as_permanent : null,
          "present_address": contact_info?.present_address ? contact_info?.present_address : "",
          "present_state_id": contact_info?.present_state_id ? contact_info?.present_state_id : "",
          "present_district_id": contact_info?.present_district_id ? contact_info?.present_district_id : "",
          "present_pincode": contact_info?.present_pincode ? contact_info?.present_pincode : "",
          "telephones": contact_info?.telephones ? contact_info?.telephones : "",
          "mobile_nos": contact_info?.mobile_nos ? contact_info?.mobile_nos : "",
          "fb_link": contact_info?.fb_link ? contact_info?.fb_link : "",
          "insta_link": contact_info?.insta_link ? contact_info?.insta_link : "",
          "twitter_link": contact_info?.twitter_link ? contact_info?.twitter_link : "",
        },
        "political_info": {
          "political_party_id": political_info?.political_party_id ? political_info?.political_party_id : "",
          "designation_id": political_info?.designation_id ? political_info?.designation_id : "",
          "parliament_house": political_info?.parliament_house ? political_info?.parliament_house : "",
          "stateid": political_info?.stateid ? political_info?.stateid : "",
          "assemblyid": political_info?.assemblyid ? political_info?.assemblyid : "",
          "parliamentaryid": political_info?.parliamentaryid ? political_info?.parliamentaryid : "",
          "is_hold_ministry": typeof political_info?.is_hold_ministry == "boolean" ? political_info?.is_hold_ministry : null,
          "ministries": political_info?.ministries?.length > 0 ? political_info?.ministries : [],
          "is_nominated": typeof political_info?.is_nominated == "boolean" ? political_info?.is_nominated : null,
          "joined_date": political_info?.joined_date ? moment(political_info?.joined_date) : null,
          "post_in_party": political_info?.post_in_party ? political_info?.post_in_party : "",
          "achievements": political_info?.achievements ? political_info?.achievements : "",
          "why_join_politics": political_info?.why_join_politics ? political_info?.why_join_politics : "",
          "is_participated_in_elections": typeof political_info?.is_participated_in_elections == "boolean" ? political_info?.is_participated_in_elections : null,
          "is_prepare_for_elections": typeof political_info?.is_prepare_for_elections == "boolean" ? political_info?.is_prepare_for_elections : null,
          "done_any_political_activity": typeof political_info?.done_any_political_activity == "boolean" ? political_info?.done_any_political_activity : null,
          "does_family_supports": typeof political_info?.does_family_supports == "boolean" ? political_info?.does_family_supports : null,
          "people_in_team": political_info?.people_in_team ? political_info?.people_in_team : "",
          "referencies": political_info?.referencies?.length > 0 ? political_info?.referencies : [],
          "elections": political_info?.elections ? political_info?.elections : "",
          "election_year": political_info?.election_year ? String(political_info?.election_year) : "",
          "election_stateid": political_info?.election_stateid ? political_info?.election_stateid : "",
          "election_constituency_id": political_info?.election_constituency_id ? political_info?.election_constituency_id : "",
          "election_parliamentary_constituency_id": political_info?.election_parliamentary_constituency_id ? political_info?.election_parliamentary_constituency_id : "",
          "position": political_info?.position ? political_info?.position : "",
          "opponents": political_info?.opponents ? political_info?.opponents : "",
          "target_elections": political_info?.target_elections ? political_info?.target_elections : "",
          "target_election_year": political_info?.target_election_year ? String(political_info?.target_election_year) : "",
          "top_priorities": political_info?.top_priorities ? political_info?.top_priorities : "",
          "activity_pictures": activity_pictures,
        },
        "general_setting": { ...general_setting }
      }
      const res = await Axios.post(APIRoutes.upsertLeaders, params);
      return res.data;
    }
  );
};
