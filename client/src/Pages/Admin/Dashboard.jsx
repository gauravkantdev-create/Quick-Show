import React, { useEffect, useMemo, useState } from 'react'
import { 
ChartLine, 
CircleDollarSign, 
PlayCircle, 
Star, 
User, 
RefreshCw, 
TrendingUp, 
Calendar 
} from 'lucide-react'

import { Link } from "react-router-dom"

import { api } from '../../Lib/api'
import Title from '../../Components/Admin/Title'
import Loading from '../../Components/Loading'
import BlurCircle from '../../Components/BlurCircle'
import { dateFormat } from '../../Lib/dateFormat'
import { useAuth } from '@clerk/clerk-react'

const Dashboard = () => {

const currency = import.meta.env.VITE_CURRENCY || '₹'
const { getToken } = useAuth()

const [dashboardData, setDashboardData] = useState({
totalBookings: 0,
totalRevenue: 0,
activeShows: [],
totalUsers: 0,
})

const [loading, setLoading] = useState(true)



/* ---------------- FETCH DASHBOARD DATA ---------------- */

const fetchDashboardData = async () => {

try {

setLoading(true)

const token = await getToken()

// ✅ FIXED (use shows instead of dashboard api)

const showsRes = await api.getShows(token)

if (showsRes.success) {

const shows = showsRes.data || []

// Filter out shows without theater assignments
const validShows = shows.filter(show => show?.theater)

const validRevenue = validShows.reduce(
(acc, show) => acc + (show.showPrice || 0),
0
)

setDashboardData({

totalBookings: 0,

totalRevenue: validRevenue,

activeShows: validShows,

totalUsers: 0

})

}

} catch (error) {

console.error("Dashboard error:", error)

} finally {

setLoading(false)

}

}


useEffect(() => {
fetchDashboardData()
}, [])



/* ---------------- DASHBOARD CARDS ---------------- */

const dashboardCards = useMemo(
() => [

{
title: 'Total Bookings',
value: dashboardData.totalBookings?.toLocaleString() || '0',
icon: ChartLine,
color: 'text-blue-400',
bgColor: 'bg-blue-500/10',
},

{
title: 'Total Revenue',
value: `${currency}${dashboardData.totalRevenue?.toLocaleString() || '0'}`,
icon: CircleDollarSign,
color: 'text-green-400',
bgColor: 'bg-green-500/10',
},

{
title: 'Active Shows',
value: dashboardData.activeShows?.length || '0',
icon: PlayCircle,
color: 'text-yellow-400',
bgColor: 'bg-yellow-500/10',
},

{
title: 'Total Users',
value: dashboardData.totalUsers?.toLocaleString() || '0',
icon: User,
color: 'text-purple-400',
bgColor: 'bg-purple-500/10',
},

],
[dashboardData, currency]
)



/* ---------------- LOADING ---------------- */

if (loading) {
return (
<div className="min-h-screen bg-black flex items-center justify-center">
<Loading />
</div>
)
}



return (

<div className="relative bg-black min-h-screen text-white">

<div className="p-6 md:p-8">

{/* Header */}

<div className="flex items-center justify-between mb-6">

<Title text1="Admin" text2="Dashboard" />

<button
onClick={fetchDashboardData}
className="flex items-center gap-2 px-3 py-2 text-sm bg-primary/20 hover:bg-primary/30 rounded"
>

<RefreshCw className="w-4 h-4" />
Refresh

</button>

</div>



{/* Quick Actions */}

<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

<Link
to="/admin/add-shows"
className="flex items-center gap-2 px-4 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg transition"
>
<PlayCircle className="w-5 h-5 text-primary" />
<span className="text-sm font-medium">Add Show</span>
</Link>


<Link
to="/admin/list-shows"
className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition"
>
<Calendar className="w-5 h-5 text-blue-400" />
<span className="text-sm font-medium">View Shows</span>
</Link>


<Link
to="/admin/list-bookings"
className="flex items-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition"
>
<ChartLine className="w-5 h-5 text-green-400" />
<span className="text-sm font-medium">Bookings</span>
</Link>


<div className="flex items-center gap-2 px-4 py-3 bg-purple-500/10 rounded-lg">
<TrendingUp className="w-5 h-5 text-purple-400" />
<span className="text-sm font-medium">
{dashboardData.activeShows?.length || 0} Active
</span>
</div>

</div>



{/* Stats Cards */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

{dashboardCards.map((card, index) => (

<div
key={index}
className={`p-4 ${card.bgColor} border border-primary/20 rounded-lg`}
>

<p className="text-sm text-gray-400">
{card.title}
</p>

<h2 className="text-2xl font-semibold mt-2">
{card.value}
</h2>

<card.icon className={`w-6 h-6 mt-3 ${card.color}`} />

</div>

))}

</div>

</div>



{/* Active Shows */}

<div className="p-6 md:p-8">

<h2 className="text-xl font-semibold mb-6">
Active Shows
</h2>


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

{dashboardData.activeShows?.map((show) => (

<div
key={show._id}
className="bg-primary/10 border border-primary/20 rounded-lg overflow-hidden hover:scale-105 transition"
>

<img
src={show.movie?.poster}
alt=""
className="h-60 w-full object-cover"
/>

<div className="p-3">

<h3 className="font-semibold">
{show.movie?.title}
</h3>

<p className="text-sm text-gray-400 mt-1">
{dateFormat(show.showDateTime)}
</p>

<div className="flex justify-between mt-2">

<p className="font-semibold">
{currency}{show.showPrice}
</p>

<p className="flex items-center gap-1 text-sm">

<Star className="w-4 h-4 text-primary fill-primary" />

{show.movie?.rating || "0"}

</p>

</div>

</div>

</div>

))}

</div>

</div>

</div>

)

}

export default Dashboard