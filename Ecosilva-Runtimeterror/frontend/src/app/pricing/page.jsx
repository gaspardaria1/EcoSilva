import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient, GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { LogoCloud } from '@/components/logo-cloud'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  MinusIcon,
} from '@heroicons/react/16/solid'

export const metadata = {
  title: 'Prețuri',
  description:
    'Planuri simple pentru ingineri individuale si enterprise.',
}

const tiers = [
  {
    name: 'Inginer',
    slug: 'inginer',
    description: 'Pentru inginerul silvic care vrea date clare direct pe teren.',
    priceMonthly: 49,
    href: '#',
    highlights: [
      { description: '1 utilizator' },
      { description: 'Până la 2 zone active' },
      { description: 'Monitorizare cipuri GPS' },
      { description: 'Alerte anomalii de bază' },
      { description: 'Chat AI (Silviq)', disabled: true },
      { description: 'Rapoarte automate', disabled: true },
    ],
    features: [
      { section: 'Monitorizare', name: 'Utilizatori', value: 1 },
      { section: 'Monitorizare', name: 'Zone active', value: 2 },
      { section: 'Monitorizare', name: 'Cipuri GPS', value: true },
      { section: 'Monitorizare', name: 'Alerte anomalii', value: true },
      { section: 'AI & Rapoarte', name: 'Chat AI (Silviq)', value: false },
      { section: 'AI & Rapoarte', name: 'Rapoarte automate', value: false },
      { section: 'AI & Rapoarte', name: 'Export PDF', value: true },
      { section: 'Suport', name: 'Suport email', value: true },
      { section: 'Suport', name: 'Onboarding dedicat', value: false },
      { section: 'Suport', name: 'Account manager', value: false },
    ],
  },
  {
    name: 'Ocol Silvic',
    slug: 'ocol',
    description: 'Pentru ocoluri silvice cu mai multe districte și echipe pe teren.',
    priceMonthly: 149,
    href: '#',
    highlights: [
      { description: 'Până la 10 utilizatori' },
      { description: 'Zone nelimitate' },
      { description: 'Monitorizare cipuri GPS' },
      { description: 'Chat AI (Silviq) inclus' },
      { description: 'Rapoarte automate Romsilva / ICAS' },
    ],
    features: [
      { section: 'Monitorizare', name: 'Utilizatori', value: 10 },
      { section: 'Monitorizare', name: 'Zone active', value: 'Nelimitat' },
      { section: 'Monitorizare', name: 'Cipuri GPS', value: true },
      { section: 'Monitorizare', name: 'Alerte anomalii', value: true },
      { section: 'AI & Rapoarte', name: 'Chat AI (Silviq)', value: true },
      { section: 'AI & Rapoarte', name: 'Rapoarte automate', value: true },
      { section: 'AI & Rapoarte', name: 'Export PDF', value: true },
      { section: 'Suport', name: 'Suport email', value: true },
      { section: 'Suport', name: 'Onboarding dedicat', value: true },
      { section: 'Suport', name: 'Account manager', value: false },
    ],
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Pentru direcții silvice și instituții cu zeci de ocoale și integrări complexe.',
    priceMonthly: 349,
    href: '#',
    highlights: [
      { description: 'Utilizatori nelimitați' },
      { description: 'Zone și districte nelimitate' },
      { description: 'Chat AI + rapoarte avansate' },
      { description: 'API propriu + integrare Romsilva' },
      { description: 'SLA dedicat + account manager' },
    ],
    features: [
      { section: 'Monitorizare', name: 'Utilizatori', value: 'Nelimitat' },
      { section: 'Monitorizare', name: 'Zone active', value: 'Nelimitat' },
      { section: 'Monitorizare', name: 'Cipuri GPS', value: true },
      { section: 'Monitorizare', name: 'Alerte anomalii', value: true },
      { section: 'AI & Rapoarte', name: 'Chat AI (Silviq)', value: true },
      { section: 'AI & Rapoarte', name: 'Rapoarte automate', value: true },
      { section: 'AI & Rapoarte', name: 'Export PDF', value: true },
      { section: 'Suport', name: 'Suport email', value: true },
      { section: 'Suport', name: 'Onboarding dedicat', value: true },
      { section: 'Suport', name: 'Account manager', value: true },
    ],
  },
]

function Header() {
  return (
    <Container className="mt-16">
      <Heading as="h1">Prețuri clare, pentru fiecare ocol.</Heading>
      <Lead className="mt-6 max-w-3xl">
        De la inginerul care monitorizează singur un district până la direcțiile
        silvice cu zeci de ocoale — există un plan potrivit. Primele 30 de zile
        sunt gratuite, fără card.
      </Lead>
    </Container>
  )
}

function PricingCards() {
  return (
    <div className="relative py-24">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, tierIndex) => (
            <PricingCard key={tierIndex} tier={tier} />
          ))}
        </div>
      </Container>
    </div>
  )
}

function PricingCard({ tier }) {
  return (
    <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
      <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
        <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
          <Subheading>{tier.name}</Subheading>
          <p className="mt-2 text-sm/6 text-gray-950/75">{tier.description}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="text-5xl font-medium text-gray-950">
              €{tier.priceMonthly}
            </div>
            <div className="text-sm/5 text-gray-950/75">
              <p>EUR</p>
              <p>pe lună</p>
            </div>
          </div>
          <div className="mt-8">
            <Button href={tier.href}>Începe gratuit 30 de zile</Button>
          </div>
          <div className="mt-8">
            <h3 className="text-sm/6 font-medium text-gray-950">
              Inclus în plan:
            </h3>
            <ul className="mt-3 space-y-3">
              {tier.highlights.map((props, featureIndex) => (
                <FeatureItem key={featureIndex} {...props} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingTable({ selectedTier }) {
  return (
    <Container className="py-24">
      <table className="w-full text-left">
        <caption className="sr-only">Comparație planuri</caption>
        <colgroup>
          <col className="w-3/5 sm:w-2/5" />
          <col
            data-selected={selectedTier === tiers[0] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
          <col
            data-selected={selectedTier === tiers[1] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
          <col
            data-selected={selectedTier === tiers[2] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
        </colgroup>
        <thead>
          <tr className="max-sm:hidden">
            <td className="p-0" />
            {tiers.map((tier) => (
              <th
                key={tier.slug}
                scope="col"
                data-selected={selectedTier === tier ? true : undefined}
                className="p-0 data-selected:table-cell max-sm:hidden"
              >
                <Subheading as="div">{tier.name}</Subheading>
              </th>
            ))}
          </tr>
          <tr className="sm:hidden">
            <td className="p-0">
              <div className="relative inline-block">
                <div>
                  <Menu>
                    <MenuButton className="flex items-center justify-between gap-2 font-medium">
                      {selectedTier.name}
                      <ChevronUpDownIcon className="size-4 fill-gray-900" />
                    </MenuButton>
                    <MenuItems
                      anchor="bottom start"
                      className="min-w-(--button-width) rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
                    >
                      {tiers.map((tier) => (
                        <MenuItem key={tier.slug}>
                          <Link
                            scroll={false}
                            href={`/pricing?tier=${tier.slug}`}
                            data-selected={
                              tier === selectedTier ? true : undefined
                            }
                            className="group flex items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-200"
                          >
                            {tier.name}
                            <CheckIcon className="hidden size-4 group-data-selected:block" />
                          </Link>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                  <ChevronUpDownIcon className="size-4 fill-gray-900" />
                </div>
              </div>
            </td>
            <td colSpan={3} className="p-0 text-right">
              <Button variant="outline" href={selectedTier.href}>
                Solicită acces
              </Button>
            </td>
          </tr>
          <tr className="max-sm:hidden">
            <th className="p-0" scope="row">
              <span className="sr-only">Solicită acces</span>
            </th>
            {tiers.map((tier) => (
              <td
                key={tier.slug}
                data-selected={selectedTier === tier ? true : undefined}
                className="px-0 pt-4 pb-0 data-selected:table-cell max-sm:hidden"
              >
                <Button variant="outline" href={tier.href}>
                  Solicită acces
                </Button>
              </td>
            ))}
          </tr>
        </thead>
        {[...new Set(tiers[0].features.map(({ section }) => section))].map(
          (section) => (
            <tbody key={section} className="group">
              <tr>
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="px-0 pt-10 pb-0 group-first-of-type:pt-5"
                >
                  <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-3 text-sm/6 font-semibold">
                    {section}
                  </div>
                </th>
              </tr>
              {tiers[0].features
                .filter((feature) => feature.section === section)
                .map(({ name }) => (
                  <tr
                    key={name}
                    className="border-b border-gray-100 last:border-none"
                  >
                    <th
                      scope="row"
                      className="px-0 py-4 text-sm/6 font-normal text-gray-600"
                    >
                      {name}
                    </th>
                    {tiers.map((tier) => {
                      let value = tier.features.find(
                        (feature) =>
                          feature.section === section && feature.name === name,
                      )?.value

                      return (
                        <td
                          key={tier.slug}
                          data-selected={
                            selectedTier === tier ? true : undefined
                          }
                          className="p-4 data-selected:table-cell max-sm:hidden"
                        >
                          {value === true ? (
                            <>
                              <CheckIcon className="size-4 fill-green-600" />
                              <span className="sr-only">
                                Inclus în {tier.name}
                              </span>
                            </>
                          ) : value === false || value === undefined ? (
                            <>
                              <MinusIcon className="size-4 fill-gray-400" />
                              <span className="sr-only">
                                Neinclus în {tier.name}
                              </span>
                            </>
                          ) : (
                            <div className="text-sm/6">{value}</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
            </tbody>
          ),
        )}
      </table>
    </Container>
  )
}

function FeatureItem({ description, disabled = false }) {
  return (
    <li
      data-disabled={disabled ? true : undefined}
      className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25"
    >
      <span className="inline-flex h-6 items-center">
        <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
      </span>
      {disabled && <span className="sr-only">Not included:</span>}
      {description}
    </li>
  )
}

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 15 15" aria-hidden="true" {...props}>
      <path clipRule="evenodd" d="M8 0H7v7H0v1h7v7h1V8h7V7H8V0z" />
    </svg>
  )
}

function Testimonial() {
  return (
    <div className="mx-2 my-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          <div className="-mt-96 lg:-mt-52">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs">
              <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                  <img
                    alt=""
                    src="/testimonials/tina-yards.jpg"
                    className="aspect-3/4 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
            <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
              <blockquote>
                <p className="text-3xl tracking-tight text-white lg:text-4xl">
                  Înainte petreceam 3 ore pe lună doar pe rapoarte. Acum le generez în 5 minute cu chatbotul și mă concentrez pe teren.
                </p>
              </blockquote>
              <figcaption className="mt-auto">
                <p className="text-sm/6 font-medium text-white">Ing. Moldovan D.</p>
                <p className="text-sm/6 font-medium">
                  <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
                    Șef district, OS Gurghiu
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </div>
  )
}

function FrequentlyAskedQuestions() {
  return (
    <Container>
      <section id="faqs" className="scroll-mt-8">
        <Subheading className="text-center">
          Întrebări frecvente
        </Subheading>
        <Heading as="div" className="mt-2 text-center">
          Tot ce vrei să știi înainte să începi.
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">
              Cine poate accesa platforma?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Platforma este disponibilă exclusiv angajaților instituțiilor silvice autorizate — ocoluri silvice, direcții silvice și inspectorate teritoriale. Conturile sunt create de administratorul instituției și nu sunt disponibile publicului.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Cum sunt protejate datele despre tăieri și locațiile GPS ale arborilor?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Toate datele sunt criptate în tranzit și în repaus. Locațiile GPS și datele din cipuri sunt stocate pe servere din România, în conformitate cu GDPR și legislația silvică în vigoare. Fiecare acces este jurnalizat.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Trebuie să știu să folosesc AI sau să scriu cod pentru a folosi chatbotul?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Nu. Platforma este gândită special pentru ingineri silvici fără experiență cu AI. Chatbotul îți sugerează prompturi, îți explică răspunsurile și te ghidează progresiv — de la cereri simple la rapoarte complexe.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Cipurile GPS funcționează offline sau în zone fără semnal?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Cipurile stochează datele local și le sincronizează automat când reintră în raza de semnal. Aplicația mobilă funcționează complet offline și sincronizează datele la prima conexiune disponibilă.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Rapoartele generate sunt acceptate oficial de Romsilva și ICAS?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Da. Rapoartele sunt generate în formatele standard solicitate de Romsilva și ICAS, includ semnătura digitală a inginerului responsabil și coordonatele GPS certificate din cipuri. Sunt gata de depus fără modificări suplimentare.
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

export default function Pricing() {
  let tier = tiers[0]

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Header />
      <PricingCards />
      <PricingTable selectedTier={tier} />
      <Footer />
    </main>
  )
}
