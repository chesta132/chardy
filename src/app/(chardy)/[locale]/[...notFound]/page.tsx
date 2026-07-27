// sometimes next.js not shows notFound on page not found so i put [...notFound] to make sure it call notFound

import { notFound } from "next/navigation";

export default async function NotFoundPage() {
  // it response 404 instead of 200
  notFound();
}
