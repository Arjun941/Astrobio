'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Download,
  Trash2,
  Camera,
  Save,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { doc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { updatePassword, updateProfile, deleteUser } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    research: boolean
    updates: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'system'
    language: string
    compactView: boolean
  }
  profile: {
    age: number
    experienceLevel: 'Novice' | 'Student' | 'Professional'
    learningStyle: 'Text' | 'Visual' | 'Audio'
  }
}

const profileFormSchema = z.object({
  age: z.coerce.number().min(10, "Must be at least 10").max(100, "Must be 100 or younger"),
  experienceLevel: z.enum(['Novice', 'Student', 'Professional']),
  learningStyle: z.enum(['Text', 'Visual', 'Audio']),
})

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Form states
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: true,
      push: true,
      research: true,
      updates: false
    },
    display: {
      theme: 'system',
      language: 'en',
      compactView: false
    },
    profile: {
      age: 18,
      experienceLevel: 'Student',
      learningStyle: 'Text'
    }
  })

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      age: preferences.profile.age,
      experienceLevel: preferences.profile.experienceLevel,
      learningStyle: preferences.profile.learningStyle,
    },
  })

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setBio(data.bio || '')
          
          // Load preferences or create defaults
          let loadedPreferences = preferences
          if (data.preferences) {
            loadedPreferences = data.preferences
          } else if (data.age || data.experienceLevel || data.learningStyle) {
            // Migration: Load from old onboarding format
            loadedPreferences = {
              ...preferences,
              profile: {
                age: data.age || 18,
                experienceLevel: data.experienceLevel || 'Student',
                learningStyle: data.learningStyle || 'Text'
              }
            }
          }
          
          setPreferences(loadedPreferences)
          
          // Update form with loaded values
          profileForm.reset({
            age: loadedPreferences.profile.age,
            experienceLevel: loadedPreferences.profile.experienceLevel,
            learningStyle: loadedPreferences.profile.learningStyle,
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [user, profileForm])

  const handleSaveProfile = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName
      })

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName,
        bio,
        preferences,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user) return
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match.",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      await updatePassword(user, newPassword)
      setNewPassword('')
      setConfirmPassword('')
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed."
      })
    } catch (error: any) {
      console.error('Error updating password:', error)
      toast({
        title: "Error",
        description: error.code === 'auth/requires-recent-login' 
          ? "Please sign out and sign in again before changing your password."
          : "Failed to update password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid))
      
      // Delete Firebase Auth account
      await deleteUser(user)
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted."
      })
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: error.code === 'auth/requires-recent-login'
          ? "Please sign out and sign in again before deleting your account."
          : "Failed to delete account. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSavePreferences = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        preferences,
        updatedAt: new Date().toISOString()
      })

      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated."
      })
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfileForm = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return
    
    setLoading(true)
    try {
      // Update local preferences state
      const updatedPreferences = {
        ...preferences,
        profile: {
          age: values.age,
          experienceLevel: values.experienceLevel,
          learningStyle: values.learningStyle
        }
      }
      setPreferences(updatedPreferences)

      // Save to Firestore
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        preferences: updatedPreferences,
        age: values.age,
        experienceLevel: values.experienceLevel,
        learningStyle: values.learningStyle,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      toast({
        title: "Profile preferences saved",
        description: "Your learning preferences have been updated successfully."
      })
    } catch (error) {
      console.error('Error saving profile preferences:', error)
      toast({
        title: "Error",
        description: "Failed to save profile preferences. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access settings</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security settings</p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and profile photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="text-lg">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} disabled={loading || !newPassword || !confirmPassword}>
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </CardTitle>
                  <CardDescription>Permanently delete your account and all associated data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-destructive font-medium">Warning: This action cannot be undone.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      All your data, including saved papers and preferences, will be permanently deleted.
                    </p>
                  </div>
                  
                  {!showDeleteDialog ? (
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Are you absolutely sure?</p>
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Yes, Delete Forever
                        </Button>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Profile Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Preferences
                  </CardTitle>
                  <CardDescription>Update your learning preferences to personalize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleSaveProfileForm)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter your age" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="experienceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Novice">Novice</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="learningStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Learning Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your learning style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Text">Text (Reading)</SelectItem>
                                <SelectItem value="Visual">Visual (Diagrams, Mindmaps)</SelectItem>
                                <SelectItem value="Audio">Audio (Listening)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Research Updates</p>
                      <p className="text-sm text-muted-foreground">New papers and research notifications</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.research}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, research: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">App updates and maintenance notifications</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.updates}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, updates: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Display Settings
                  </CardTitle>
                  <CardDescription>Customize your app appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact View</p>
                      <p className="text-sm text-muted-foreground">Show more content in less space</p>
                    </div>
                    <Switch
                      checked={preferences.display.compactView}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({
                          ...prev,
                          display: { ...prev.display, compactView: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePreferences} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save All Preferences'}
                </Button>
              </div>
            </motion.div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  )
}