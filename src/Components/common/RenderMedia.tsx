const RenderMedia = ({ url }: { url: string }) => {
  try {
    const mainUrl = url.split("?")[0];
    const split = mainUrl.split(".");
    const format = split[split.length - 1];
    if (
      format.includes("jpg") ||
      format.includes("png") ||
      format.includes("gif") ||
      format.includes("jpeg") ||
      format.includes("svg") ||
      format.includes("webp")
    ) {
      return <img src={url} alt="upload image" style={{ marginBottom: "1rem" }} />;
    }

    return (
      <video controls width="300" style={{ marginBottom: "1rem" }}>
        <source src={url} type={`video/${format}`} />
        Sorry, your browser does not support embedded videos.
      </video>
    );
  } catch (error) {
    console.log(error);
  }
  return <div>Loading...</div>;
};

export default RenderMedia;
