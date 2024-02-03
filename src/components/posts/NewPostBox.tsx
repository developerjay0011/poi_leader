"use client";
import { cusDispatch, cusSelector } from "@/redux_store/cusHooks";
import { createNewPost } from "@/redux_store/posts/postAPI";
import { CommonBox } from "@/utils/CommonBox";
import { ErrObj, MediaPost, NewPostFields, PostType } from "@/utils/typesUtils";
import { GenerateId, convertFileToBase64 } from "@/utils/utility";
import Image from "next/image";
import { FC, FormEvent, useState, ChangeEvent } from "react";
import { BiX } from "react-icons/bi";
import { BsImageFill } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
import { fetchAddPost } from "../api/posts";
import { RootState } from "@/redux_store";

interface NewPostBoxProps {}

export const NewPostBox: FC<NewPostBoxProps> = () => {
  const [media, setMedia] = useState<NewPostFields[]>([]);
  const [textPost, setTextPost] = useState("");
  const [postErr, setPostErr] = useState<ErrObj>({ errTxt: "", isErr: false });
  const dispatch = cusDispatch();
  const { creatingPost } = cusSelector((st) => st.posts);
  const { userDetails } = cusSelector((st) => st.UI);

  const userData: any = cusSelector(
    (state: RootState) => state.auth.userDetails
  );

  console.log(userData);
  console.log(userData?.data?.leader_detail?.id);

  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (textPost.trim().length === 0 && media.length === 0)
      return setPostErr({ errTxt: "post can't be empty", isErr: true });

    dispatch(
      createNewPost({
        media: media,
        type: "post",
        writtenText: textPost,
      })
    );

    const token = userData?.token;
    const postBody = {
      leaderid: userData?.data?.leader_detail?.id || "",
      written_text: textPost || "",
      access_type: "post",
      media: media?.map((item) => ({
        type: item?.type,
        media: item?.media,
      })),
    };

    try {
      const data = await fetchAddPost(postBody, token);
      console.log(data);
      if (data?.success) {
       /*  {
          "success": true,
          "message": "added successfully.",
          "data": null
      } */
      }
      
    } catch (error) {
      console.log(error);
    }
    console.log(textPost);

    setMedia([]);
    setTextPost("");
  };

  const mediaChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setPostErr({
      errTxt: "",
      isErr: false,
    });

    const data = e.target.files as FileList;

    if (!data) return;

    for (let i = 0; i < data.length; i++) {
      const uploadData = data[i];

      // checking for media type
      if (
        !(
          uploadData.type.includes("image") || uploadData.type.includes("video")
        )
      )
        return setPostErr({
          errTxt: "File type not allowed",
          isErr: true,
        });

      // converting data into base 64
      const convertedData = await convertFileToBase64(uploadData);

      setMedia((lst) => {
        const oldData = [...lst];

        oldData.push({
          type: uploadData.type.split("/")[0] as PostType,
          media: convertedData as string,
          id: GenerateId(),
        });

        return oldData;
      });
    }
  };

  const removeImageHandler = (id: string) => {
    setPostErr({
      errTxt: "",
      isErr: false,
    });

    setMedia((lst) => {
      const newData = [...lst];

      newData.splice(
        newData.findIndex((dt) => dt.id === id),
        1
      );

      return newData;
    });
  };

  return (
    <>
      <CommonBox title="create post">
        <form className="flex flex-col gap-4 py-4" onSubmit={formSubmitHandler}>
          <div className="flex items-start gap-3">
            <Image
              src={userDetails?.displayPic as string}
              alt="user image"
              width={1000}
              height={1000}
              className="rounded-full w-14 overflow-hidden bg-red-500 aspect-square object-center object-cover self-start"
            />
            <textarea
              rows={5}
              value={textPost}
              className="resize-none flex-1 outline-none placeholder:capitalize text-sm focus:p-3 focus:bg-zinc-100 transition-all rounded"
              onChange={(e) => {
                setPostErr({ errTxt: "", isErr: false });
                setTextPost(e.target.value);
              }}
              placeholder="share what your are thinking?"
            ></textarea>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="liveMedia">
              <FaCamera className="text-sky-950 text-xl text-opacity-70" />
            </label>

            <label htmlFor="media">
              <input
                type="file"
                className="hidden"
                id="media"
                multiple
                onChange={mediaChangeHandler}
              />
              <BsImageFill className="text-sky-950 text-xl text-opacity-70" />
            </label>
          </div>

          {postErr.isErr && (
            <p className="text-red-500 text-[14px]">{postErr.errTxt}</p>
          )}

          {/* Preview box */}
          {media.length > 0 && (
            <div className="">
              {/* Preview Line */}
              <div className="preview">
                <p>preview</p>
                <span className="line" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {media.map((el) => (
                  <div className="w-20 aspect-square relative" key={el.id}>
                    {el.type === "image" && (
                      <Image
                        src={el.media}
                        width={1000}
                        height={1000}
                        alt="media post"
                        className="w-full h-full aspect-square object-cover object-center"
                      />
                    )}
                    {el.type === "video" && (
                      <video
                        src={el.media}
                        className="w-full h-full aspect-square object-cover object-center"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeImageHandler(el.id)}
                      className="bg-black bg-opacity-50 text-white text-lg rounded-full absolute top-1 right-1"
                    >
                      <BiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={creatingPost}
            className="bg-sky-400 text-sky-50 py-1 rounded-md capitalize font-[500]"
          >
            {creatingPost ? "posting.." : "post"}
          </button>
        </form>
      </CommonBox>
    </>
  );
};
