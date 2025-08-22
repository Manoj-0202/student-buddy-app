
import { FaHome, FaUser, FaPlay, FaChartBar } from "react-icons/fa";

export const homeConfig = {
  brand: "StudyBuddy",
  greeting: "Welcome back, Alex!",
  welcomeCard: {
    image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_4_Frame_0_pn6j2y.jpg",
    alt: "AI learning illustration",
    subhead: "AI–Powered Learning",
    muted: "Discover smarter ways to learn and grow with AI. Get real-time insights, personalized guidance, and progress tracking—designed for anyone who wants to unlock their full potential.",
    buttonText: "Start Learning",
  },
  workFlow: {
    title: "Work Flow",
    actions: [
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_l8ygn0.jpg",
        title: "Pre-Test",
        description: "Assess your current knowledge and identify strengths and gaps before you begin.",
      },
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_1_sehooy.jpg",
        title: "AI Understanding",
        description: "Get personalized insights and explanations powered by AI to simplify complex topics.",
      },
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_2_jv7zid.jpg",
        title: "Final Test",
        description: "Measure your progress, validate improvements, and see how much you’ve learned.",
      },
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_3_az9hct.jpg",
        title: "Practice",
        description: "Reinforce your knowledge with exercises and hands-on practice for better retention.",
      },
    ],
  },
  features: {
    title: "Features",
    items: [
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_5_d9vrhi.jpg",
        alt: "Instant Feedback",
        label: "Instant Feedback",
        muted: "Get real-time feedback on your progress.",
      },
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_4_yidyz3.jpg",
        alt: "Daily Feedback",
        label: "Daily Feedback",
        muted: "Engage in daily practice sessions.",
      },
      {
        image: "https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_4_yidyz3.jpg",
        alt: "Growth Tracker",
        label: "Growth Tracker",
        muted: "Track progress with simple visuals.",
      },
    ],
  },
  navConfig: {
    logo: "StudyBuddy",
    navItems: [
      {
        path: "/",
        icon: FaHome,
        text: "Home",
      },
      {
        path: "/dashboard",
        icon: FaChartBar,
        text: "Dashboard",
      },
      {
        path: "/upload",
        icon: FaPlay,
        text: "Start Learning",
      },
      {
        path: "/profile",
        icon: FaUser,
        text: "Profile",
      },
    ],
  },
};
