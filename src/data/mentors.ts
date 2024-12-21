import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
} from 'data/images';

export interface Mentor {
  id: number;
  name: string;
  title: string;
  avatar: string;
  task: number;
  rating: number;
  review: number;
  followed: boolean;
}

export const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Curious George',
    title: 'UI UX Design',
    avatar: Avatar1,
    task: 40,
    rating: 4.7,
    review: 750,
    followed: false,
  },
  {
    id: 2,
    name: 'Abraham Lincoln',
    title: '3D Design',
    avatar: Avatar2,
    task: 32,
    rating: 4.9,
    review: 510,
    followed: true,
  },
  {
    id: 3,
    name: 'Alex Stanton',
    title: 'UI / UX Designer',
    avatar: Avatar3,
    task: 60,
    rating: 4.9,
    review: 970,
    followed: false,
  },
  {
    id: 4,
    name: 'Richard Kyle',
    title: '2D Design',
    avatar: Avatar4,
    task: 60,
    rating: 4.7,
    review: 730,
    followed: false,
  },
  {
    id: 5,
    name: 'Brian Robinson',
    title: 'Android Developer',
    avatar: Avatar5,
    task: 28,
    rating: 4.8,
    review: 370,
    followed: true,
  },
  {
    id: 6,
    name: 'Jakob Saris',
    title: '3D Design',
    avatar: Avatar6,
    task: 60,
    rating: 4.8,
    review: 870,
    followed: false,
  },
  {
    id: 7,
    name: 'Jeremy Zucker',
    title: 'Web Developer',
    avatar: Avatar7,
    task: 40,
    rating: 4.7,
    review: 750,
    followed: false,
  },
  {
    id: 8,
    name: 'Jason Statham',
    title: 'IOS Developer',
    avatar: Avatar8,
    task: 60,
    rating: 4.9,
    review: 910,
    followed: true,
  },
];
