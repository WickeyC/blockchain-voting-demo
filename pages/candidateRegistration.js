import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

//Internal Import
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoters.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const candidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();
  const {
    uploadToIPFSCandidate,
    createCandidate,
    candidateArray,
    getAllCandidateData,
  } = useContext(VotingContext);

  //VOTERS IMAGE DROP
  const onDrop = useCallback(async (acceptedFiles) => {
    const url = await uploadToIPFSCandidate(acceptedFiles[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getAllCandidateData();
  }, []);

  //JSX PART
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbps; {candidateForm.name}</span>
              </p>
              <p>
                Add:&nbps; <span> {candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                Age:&nbps; <span> {candidateForm.age}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate For Voting</h4>
              <p>Blockchain Voting with DCast.</p>
              <p className={Style.sideInfo_para}>Contract Candidate List</p>
            </div>

            <div className={Style.card}>
              {console.log(candidateArray)}
              {candidateArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[2]} alt="Profile photo" />
                  </div>

                  <div className={Style.card_info}>
                    <p>
                      {el[0]} #{el[1].toNumber()}
                    </p>
                    {/* <p>Address: {el[4].slice(0, 10)}..</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create New Candidate</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voter_container_box_div_info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>
                  <div className={Style.voter_container_box_div_image}>
                    <Image
                      src={images.upload}
                      width={150}
                      height={150}
                      objectFit="contain"
                      alt="File upload"
                    />
                  </div>
                  <p>Drag & Drop File</p>
                  <p>or Browse Media on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Candidate Name"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Candidate Address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Candidate Age"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, age: e.target.value })
            }
          />
        </div>

        <div className={Style.Button}>
          <Button
            btnName="Authorised Candidate"
            handleClick={() => createCandidate(candidateForm, fileUrl, router)}
          />
        </div>
      </div>

      {/* ------------------------------ */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <Image src={images.creator} alt="use Profile" />
          <p>Notice For User</p>
          <p>
            Organiser <span>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</span>
          </p>
          <p>Only organiser of the voting contract can create candidate.</p>
        </div>
      </div>
    </div>
  );
};

export default candidateRegistration;
