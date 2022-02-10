import { useEffect, useState, useRef } from "react";
import "./NftCard.css";
import { SerializedNftMetadata } from "../types";
import VisibilitySensor from "react-visibility-sensor";

interface Props {
  nft: SerializedNftMetadata;
}

const NftCard = ({ nft }: Props) => {
  const MaxTextLength = 100;
  const videoRef = useRef(null);
  const [openDescription, setOpenDescription] = useState(false);
  const [openName, setOpenName] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  const handleClick = () => {
    window.open(nft.link, "_blank");
  };

  const handleUserNameClick = () => {
    window.open(
      `https://opensea.io/accounts/${nft.creator.username}`,
      "_blank"
    );
  };

  useEffect(() => {
    const element = document.getElementById(nft.name);
    if (element) {
      element.addEventListener(
        "error",
        (e) => {
          setShowVideo(false);
        },
        true
      );
    }
  }, [nft]);

  useEffect(() => {
    if (isVisible) {
      if (videoRef && videoRef.current) {
        (videoRef.current as any).play();
      }
    } else {
      if (videoRef && videoRef.current) {
        (videoRef.current as any).pause();
      }
    }
  }, [isVisible]);

  const renderName = () => {
    const handleMoreClick = () => {
      setOpenName(true);
    };

    if (openName) {
      return nft.name;
    } else {
      return nft.name.length > MaxTextLength ? (
        <>
          {nft.name.substring(0, MaxTextLength) + "..."}
          <span onClick={handleMoreClick} className="more">
            more
          </span>
        </>
      ) : (
        nft.name
      );
    }
  };

  const renderDescription = () => {
    const handleMoreClick = () => {
      setOpenDescription(true);
    };

    if (openDescription) {
      return nft.description;
    } else {
      return nft.description.length > MaxTextLength ? (
        <>
          {nft.description.substring(0, MaxTextLength) + "..."}
          <span onClick={handleMoreClick} className="more">
            more
          </span>
        </>
      ) : (
        nft.description
      );
    }
  };

  const shouldRenderVideo = () => {
    if (!showVideo) {
      return false;
    }
    if (nft.animationUrl) {
      if (
        !nft.animationUrl.endsWith(".gif") &&
        !nft.animationUrl.endsWith(".gltf") &&
        !nft.animationUrl.endsWith(".glb") &&
        !nft.animationUrl.endsWith(".mp3")
      ) {
        return true;
      }
    }
    // For case when image_url incorrectly provides video file
    if (nft.image && nft.image.endsWith(".mp4")) {
      return true;
    }
    return false;
  };
  return (
    <div className="NFT-container">
      <div className="NFT-image-container">
        {shouldRenderVideo() ? (
          <VisibilitySensor onChange={(isVis) => setIsVisible(isVis)}>
            <video
              id={nft.name}
              onClick={handleClick}
              muted
              playsInline
              autoPlay
              controlsList="nodownload"
              loop
              preload="auto"
              src={nft.animationUrl || nft.image}
              className="NFT-image"
              ref={videoRef}
            />
          </VisibilitySensor>
        ) : (
          <img
            src={nft.image}
            className="NFT-image"
            onClick={handleClick}
            alt={nft.name}
          />
        )}
      </div>
      <div className="NFT-infoContainer">
        <div className="NFT-name" onClick={handleClick}>
          {renderName()}
        </div>
        <div className="NFT-description">
          {nft.description ? renderDescription() : null}
        </div>
        <div className="divider" />
        <div className="created-by">
          {nft.creator.profile_img ? (
            <img
              src={nft.creator.profile_img}
              alt="profile"
              className="created-by-image"
            />
          ) : (
            <div />
          )}
          <span className="created-by-text">Created by</span>
          <span className="created-by-username" onClick={handleUserNameClick}>
            {nft.creator.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
