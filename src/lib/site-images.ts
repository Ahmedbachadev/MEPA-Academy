import heroCampus from "@/assets/hero-campus.jpg";
import aboutClassroom from "@/assets/about-classroom.jpg";
import galleryLab from "@/assets/gallery-lab.jpg";
import galleryLibrary from "@/assets/gallery-library.jpg";
import galleryLecture from "@/assets/gallery-lecture.jpg";
import galleryCampus from "@/assets/gallery-campus.jpg";
import activityWorkshop from "@/assets/activity-workshop.jpg";
import activityTour from "@/assets/activity-tour.jpg";
import activityCompetition from "@/assets/activity-competition.jpg";
import activityCommunity from "@/assets/activity-community.jpg";
import activityClubs from "@/assets/activity-clubs.jpg";
import activityCareer from "@/assets/activity-career.jpg";
import eventSymposium from "@/assets/event-symposium.jpg";
import eventLeadership from "@/assets/event-leadership.jpg";
import eventCareer from "@/assets/event-career.jpg";
import courseScience from "@/assets/course-science.jpg";
import courseMath from "@/assets/course-math.jpg";
import courseCs from "@/assets/course-cs.jpg";
import courseBusiness from "@/assets/course-business.jpg";
import courseLiterature from "@/assets/course-literature.jpg";
import courseArts from "@/assets/course-arts.jpg";

export const siteImages: Record<string, string> = {
  "hero-campus": heroCampus,
  "about-classroom": aboutClassroom,
  "gallery-lab": galleryLab,
  "gallery-library": galleryLibrary,
  "gallery-lecture": galleryLecture,
  "gallery-campus": galleryCampus,
  "activity-workshop": activityWorkshop,
  "activity-tour": activityTour,
  "activity-competition": activityCompetition,
  "activity-community": activityCommunity,
  "activity-clubs": activityClubs,
  "activity-career": activityCareer,
  "event-symposium": eventSymposium,
  "event-leadership": eventLeadership,
  "event-career": eventCareer,
  "course-science": courseScience,
  "course-math": courseMath,
  "course-cs": courseCs,
  "course-business": courseBusiness,
  "course-literature": courseLiterature,
  "course-arts": courseArts,
};

export function resolveImage(key: string | null | undefined, fallback = heroCampus): string {
  if (!key) return fallback;
  // Full URL or data URL -> use as-is
  if (/^(https?:|data:|blob:|\/)/i.test(key)) return key;
  return siteImages[key] ?? fallback;
}

export { heroCampus };
