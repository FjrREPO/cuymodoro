import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "./button";

function useFeatures() {
  return useQuery({
    queryKey: ["get_last_features"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/features/last/${localStorage.getItem(
          "username"
        )}`
      );
      return data;
    },
  });
}

function Hero() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const { data, error, isFetching } = useFeatures();

  const addFeature = useMutation({
    mutationFn: () => {
      return axios.post(`${import.meta.env.VITE_API_URL}/features/add`, {
        username: localStorage.getItem("username"),
        title,
        level,
      });
    },
    onMutate: () => location.reload(),
  });

  const breakFeature = useMutation({
    mutationFn: () => {
      return axios.put(`${import.meta.env.VITE_API_URL}/features/break`, {
        id: data?.features?.id,
        username: localStorage.getItem("username"),
      });
    },
    onMutate: () => location.reload(),
  });

  const resumeFeature = useMutation({
    mutationFn: () => {
      return axios.put(`${import.meta.env.VITE_API_URL}/features/resume`, {
        id: data?.features?.id,
        username: localStorage.getItem("username"),
        level,
      });
    },
    onMutate: () => location.reload(),
  });

  const finishFeature = useMutation({
    mutationFn: () => {
      return axios.put(`${import.meta.env.VITE_API_URL}/features/finish`, {
        id: data?.features?.id,
        username: localStorage.getItem("username"),
      });
    },
    onMutate: () => location.reload(),
  });

  useEffect(() => {
    localStorage.setItem("username", "admin");
  }, []);

  if (isFetching) return <div>please wait...</div>;
  if (error) return <div>error, reload the page please :|</div>;

  return (
    <div className="hero">
      <div className="flex flex-col gap-4 w-full p-8">
        <h1 className="text-4xl text-center font-bold"> Cuymodoro</h1>
        <hr />
        <div>
          {addFeature.isError || breakFeature.isError ? (
            <p>An error occurred</p>
          ) : null}
          {data?.features?.status && <i>status: {data?.features?.status}</i>}
          {data?.features?.status && data?.features?.status == "break" ? (
            <p>take a break for xx:xx minutes</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            onChange={(e) =>
              !data?.features?.status ? setTitle(e.target.value) : null
            }
            placeholder="Fitur apa yang kamu kerjain"
            className="input input-bordered w-full rounded-md"
            defaultValue={data?.features?.title}
            disabled={
              data?.features?.status && data?.features?.status !== "done"
            }
          />
          <select
            className="select select-bordered w-full"
            onChange={(e) => setLevel(e.target.value)}
            value={level || data?.features?.level}
            disabled={
              data?.features?.status && data?.features?.status !== "break"
            }
          >
            <option defaultValue={"-"}>Pilih Break Level</option>
            <option value={"newcomers"}>New Comers</option>
            <option value={"reguler"}>Reguler</option>
            <option value={"enthusiast"}>Enthusiast</option>
          </select>
          <Button
            status={data?.features?.status}
            addFeature={addFeature}
            breakFeature={breakFeature}
            resumeFeature={resumeFeature}
          />
          {data?.features?.status == "break" ? (
            <button onClick={() => finishFeature.mutate()}>Selesai</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Hero;
