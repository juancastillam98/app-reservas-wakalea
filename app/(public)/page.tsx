import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/home/hero-section"
import { RegionsSection } from "@/components/home/regions-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { SeasonalBanner } from "@/components/home/seasonal-banner"
import { TrustSection } from "@/components/home/trust-section"
import { LeadSection } from "@/components/home/lead-section"
import type { Region, Experience } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch regions
  const { data: regions } = await supabase
    .from("regions")
    .select("*")
    .order("name")

  // Fetch featured experiences with joined region + category
  const { data: featured } = await supabase
    .from("experiences")
    .select("*, regions(*), categories(*)")
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(6)

  return (
    <>
      <HeroSection regions={(regions as Region[]) || []} />
      <RegionsSection regions={(regions as Region[]) || []} />
      <FeaturedSection experiences={(featured as Experience[]) || []} />
      <SeasonalBanner />
      <TrustSection />
      <LeadSection />
    </>
  )
}
