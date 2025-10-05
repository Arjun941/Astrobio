'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { LinkedinIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const teamMembers = [
  {
    name: 'Arjun TK',
    role: 'Developer',
    image: 'https://storage.googleapis.com/creatorspace-public/users%2Fcm70r8xve06fou401q2fs63uj%2FYXV4UpHGNQtEMclk-551364895_18050372519639825_8823935349765773614_n.jpg',
    linkedin: 'https://www.linkedin.com/in/arjuntk005?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B3okKBjE3RnuD71zdvtJqYA%3D%3D'
  },
  {
    name: 'Aleena Darvin',
    role: 'Research',
    image: 'https://media.licdn.com/dms/image/v2/D5635AQHjnRelAZvqHw/profile-framedphoto-shrink_400_400/B56ZfO5Jr0GQAc-/0/1751522778220?e=1760252400&v=beta&t=1tvyaIoAzUyp9s4YrvkxGVozYh-YgQqAWFNgV-k8jdI',
    linkedin: 'https://www.linkedin.com/in/aleena-darvin-0875102a1?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BsRw9xIPpTECzikDCcVNzgg%3D%3D'
  },
  {
    name: 'Vaishakh VS',
    role: 'Developer',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQFi08eH35Jx9Q/profile-displayphoto-scale_400_400/B4DZi9oioAHYAw-/0/1755528180156?e=1762387200&v=beta&t=Lz3jRQ_iEjiCs3kNi1FRrgI_GOoULGILetAD1e6BJlg',
    linkedin: 'https://www.linkedin.com/in/vaishakh-vs'
  },
  {
    name: 'Hithesh G',
    role: 'Product Manager',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQHD-4cw_0vlFA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1704535091778?e=1762387200&v=beta&t=BUpsXTFAx2U2cIFQ6at55kJYrvMQgsyX9ohzB95aa7E',
    linkedin: 'https://www.linkedin.com/in/hithesh-g?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BokANwHPRRqWa7ZpqMAZxeQ%3D%3D'
  }
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The team behind AstroBio Engine, making space biology research easier to access with AI tools.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 group">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto ring-4 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300">
                      <AvatarImage 
                        src={member.image} 
                        alt={member.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg font-semibold bg-accent/10 text-accent">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* LinkedIn Badge */}
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-2 -right-2 p-2 bg-[#0077B5] text-white rounded-full hover:scale-110 transition-transform duration-200 shadow-lg"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  <CardTitle className="text-xl font-semibold group-hover:text-accent transition-colors duration-300">
                    {member.name}
                  </CardTitle>
                  
                  <Badge 
                    variant="secondary" 
                    className="mx-auto w-fit bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-300"
                  >
                    {member.role}
                  </Badge>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-accent">
                About AstroBio Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                AstroBio Engine was built to democratize access to space biology research. Our team combined expertise in 
                AI development, scientific research, user experience, and product management to create a platform that makes 
                complex scientific literature accessible through intelligent summarization, interactive visualizations, and 
                AI-powered insights.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2">
                  🚀 Space Biology Knowledge Engine
                </Badge>
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2">
                  🤖 AI-Powered Research Platform
                </Badge>
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2">
                  📚 600+ Scientific Publications
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/papers" className="inline-flex items-center">
              Explore Our Platform
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}