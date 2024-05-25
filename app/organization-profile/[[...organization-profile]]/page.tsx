import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
        <OrganizationProfile path="/organization-profile" />
    </div>
  )
}