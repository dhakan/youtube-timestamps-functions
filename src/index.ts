import { google, youtube_v3 } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.YT_API_KEY;

const VIDEO_ID = "_-yXNxHk4x8"; // Mario odyssey

const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

const params: youtube_v3.Params$Resource$Videos$List = {
  id: [VIDEO_ID],
  part: ["snippet"],
};

// Retrieve the captions (transcripts) for the video
async function getVideoTranscript(
  videoId: string
): Promise<string | undefined> {
  try {
    const captionsResponse = await youtube.captions.list({
      videoId,
      part: ["snippet"],
    });

    // Assuming there is at least one caption track, retrieve the transcript
    const captionTrack = captionsResponse.data.items?.[0];
    if (captionTrack?.id) {
      const transcriptResponse = await youtube.captions.download({
        id: captionTrack.id,
        // t: "ttml", // You can adjust the format as needed (e.g., 'ttml', 'srt', 'vtt')
      });

      return transcriptResponse.data as string | undefined;
    }

    return undefined;
  } catch (error) {
    console.error("Error retrieving transcript:", error);
    return undefined;
  }
}

// Call the function with the video ID
// getVideoTranscript(VIDEO_ID)
//   .then((transcript) => {
//     if (transcript) {
//       console.log("Video Transcript:", transcript);
//     } else {
//       console.log("No transcript available for the video.");
//     }
//   })
//   .catch((error) => console.error("Error:", error));
