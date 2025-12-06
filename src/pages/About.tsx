import { Link } from 'react-router-dom';
import { Heart, Users, Globe, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '10K+', label: 'Crevators' },
  { value: '50K+', label: 'Products' },
  { value: '100K+', label: 'Happy Customers' },
  { value: '25+', label: 'Countries' },
];

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every product in our marketplace is crafted by passionate crevators who pour their heart and soul into their work.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in building meaningful connections between creators and those who appreciate handmade artistry.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting talented crevators from around the world with customers who value unique, handcrafted items.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'We maintain high standards to ensure every purchase meets our commitment to excellence and authenticity.',
  },
];

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    bio: 'Former textile designer with a passion for supporting independent creators.',
  },
  {
    name: 'David Chen',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    bio: 'E-commerce veteran focused on creating seamless experiences for sellers and buyers.',
  },
  {
    name: 'Emma Wilson',
    role: 'Community Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    bio: 'Connecting crevators with their audience and fostering a supportive creative community.',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-hero py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto">
            Celebrating the Art of{' '}
            <span className="text-primary">Handmade</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Crevea was born from a simple belief: handmade items carry
            stories, passion, and a connection that mass-produced goods can never match.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We started Crevea in 2020 with a mission to create a
                  space where talented craftspeople could share their creations
                  with the world. What began as a small community has grown into
                  a vibrant marketplace connecting thousands of crevators with
                  appreciative customers worldwide.
                </p>
                <p>
                  We believe that every handmade item tells a story. Whether it's
                  a cozy crochet blanket, an original painting, or a piece of
                  handcrafted pottery, each creation carries the maker's passion,
                  skill, and unique perspective.
                </p>
                <p>
                  Our goal is to make it easy for crevators to reach customers who
                  truly value their work, while providing buyers with a curated
                  selection of authentic, high-quality handmade goods.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                  alt="Crevator crafting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-background shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300"
                  alt="Art supplies"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Crevea
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-6 border animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Crevea
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="font-display text-xl">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-warm text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Join Our Creative Community
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Whether you're a creator looking to share your work or a buyer
            seeking unique handmade treasures, there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="hero" asChild>
              <Link to="/products">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="hero" asChild>
              <Link to="/auth?mode=register&type=vendor">
                Become a Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
