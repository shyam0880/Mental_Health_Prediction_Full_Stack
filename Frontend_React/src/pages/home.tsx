import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { Users, Heart, TrendingUp, Shield, Brain, BarChart3, MessageCircle, UserCheck, ClipboardCheck, HandHeart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "@/lib/theme";

export default function Home() {
  const { dark } = useTheme();
  const [liveStats, setLiveStats] = useState({ activeUsers: 1847, assessmentsCompleted: 8923, supportSessions: 2156 });
  const { data: mentalHealthStats } = useQuery({ queryKey: ["/api/mental-health-stats"] });

  const liveChartData = [
    { month: "Jan", assessments: 120 }, { month: "Feb", assessments: 190 },
    { month: "Mar", assessments: 300 }, { month: "Apr", assessments: 500 },
    { month: "May", assessments: 200 }, { month: "Jun", assessments: 300 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        assessmentsCompleted: prev.assessmentsCompleted + Math.floor(Math.random() * 3),
        supportSessions: prev.supportSessions + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tickColor = dark ? "#94A3B8" : "#64748B";
  const tooltipStyle = dark
    ? { backgroundColor: "#1E293B", border: "1px solid #475569", color: "#F1F5F9" }
    : { backgroundColor: "#fff", border: "1px solid #e2e8f0", color: "#1e293b" };

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Workplace Mental Health Companion</h1>          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Take control of your mental wellness with data-driven insights and personalized support
          </p>
          <Link href="/checkup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300">
              Check Your Mental Health Now
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Awareness ── */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                Mental Health Crisis in Today's World
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                In today's fast-paced work environment, mental health challenges have become increasingly prevalent.
                Millions of professionals worldwide struggle with stress, anxiety, and burnout.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/40 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">1 in 4</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">people affected globally</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/40 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$1T</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">annual economic cost</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-100 dark:from-blue-900/40 to-purple-100 dark:to-purple-900/40 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full flex items-center justify-center">
                  <Brain className="text-white w-16 h-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="w-80 h-80 bg-gradient-to-br from-green-100 dark:from-green-900/40 to-blue-100 dark:to-blue-900/40 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-green-300 to-blue-300 rounded-full flex items-center justify-center">
                  <Heart className="text-white w-16 h-16" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                Why Mental Health Matters at Work
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Mental health is not just a personal issue — it's a critical business concern. Investing in mental
                health support creates a positive workplace culture that benefits everyone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/40 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">4x</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">ROI on mental health investment</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">25%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">increase in productivity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Mental Health in the Workplace
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users,      bg: "bg-blue-600",   text: "text-blue-600 dark:text-blue-400",   end: 76,  suffix: "%", label: "experience workplace stress" },
              { icon: Heart,      bg: "bg-green-600",  text: "text-green-600 dark:text-green-400", end: (mentalHealthStats as any)?.totalRecords || 1259, suffix: "", label: "people helped this month" },
              { icon: TrendingUp, bg: "bg-purple-600", text: "text-purple-600 dark:text-purple-400", end: 42, suffix: "%", label: "report burnout symptoms" },
              { icon: Shield,     bg: "bg-amber-600",  text: "text-amber-600 dark:text-amber-400",  end: 89, suffix: "%", label: "accuracy in predictions" },
            ].map(({ icon: Icon, bg, text, end, suffix, label }) => (
              <Card key={label} className="text-center p-6 border-0 card-hover bg-white dark:bg-slate-700">
                <CardContent className="p-0">
                  <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  <div className={`text-3xl font-bold ${text} mb-2`}>
                    <AnimatedCounter end={end} suffix={suffix} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live data ── */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Real-Time Mental Health Insights
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Live data from our global community</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Mental Health Assessments</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={liveChartData}>
                      <XAxis dataKey="month" tick={{ fill: tickColor }} axisLine={{ stroke: tickColor }} />
                      <YAxis tick={{ fill: tickColor }} axisLine={{ stroke: tickColor }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="assessments" stroke="hsl(221,83%,53%)" strokeWidth={3}
                        dot={{ fill: "hsl(221,83%,53%)", strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {[
                { label: "Active Users Today",     value: liveStats.activeUsers,          iconBg: "bg-blue-100 dark:bg-blue-900/40",   iconText: "text-blue-600 dark:text-blue-400",   valText: "text-blue-600 dark:text-blue-400",   icon: UserCheck },
                { label: "Assessments Completed",  value: liveStats.assessmentsCompleted, iconBg: "bg-green-100 dark:bg-green-900/40", iconText: "text-green-600 dark:text-green-400", valText: "text-green-600 dark:text-green-400", icon: ClipboardCheck },
                { label: "Support Sessions",       value: liveStats.supportSessions,      iconBg: "bg-purple-100 dark:bg-purple-900/40", iconText: "text-purple-600 dark:text-purple-400", valText: "text-purple-600 dark:text-purple-400", icon: HandHeart },
              ].map(({ label, value, iconBg, iconText, valText, icon: Icon }) => (
                <Card key={label} className="p-6 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <CardContent className="p-0 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{label}</h3>
                      <p className={`text-3xl font-bold ${valText}`}>{value.toLocaleString()}</p>
                    </div>
                    <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center`}>
                      <Icon className={`${iconText} w-5 h-5`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">How MHealthCheck Helps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain,         bg: "bg-blue-600",   title: "AI-Powered Assessment",  desc: "Get personalized mental health insights using machine learning algorithms trained on comprehensive datasets." },
              { icon: BarChart3,     bg: "bg-green-600",  title: "Data-Driven Insights",   desc: "Visualize workplace mental health trends and patterns to make informed decisions about your wellbeing." },
              { icon: MessageCircle, bg: "bg-purple-600", title: "24/7 Support",            desc: "Access mental health tips, resources, and guidance whenever you need it through our intelligent chatbot." },
            ].map(({ icon: Icon, bg, title, desc }) => (
              <Card key={title} className="text-center p-8 border-0 card-hover bg-white dark:bg-slate-800">
                <CardContent className="p-0">
                  <div className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
