
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Award,
  Percent
} from "lucide-react";
import { TravelOffer } from "@/types";

interface KPICardsProps {
  offers: TravelOffer[];
}

const KPICards = ({ offers }: KPICardsProps) => {
  const { t } = useTranslation();
  
  // Example KPI stats - in a real app these would be calculated from actual offers
  const stats = {
    totalOffers: offers.length,
    acceptedOffers: offers.filter(o => o.status === 'accepted' || o.status === 'completed').length,
    conversionRate: Math.round((offers.filter(o => o.status === 'accepted' || o.status === 'completed').length / offers.length) * 100) || 0,
    averagePriceEUR: Math.round(offers.reduce((sum, offer) => sum + offer.price, 0) / offers.length) || 0,
    pendingPayments: offers.filter(o => o.status === 'accepted' && !o.paymentReference).length,
    completedDeals: offers.filter(o => o.status === 'completed').length,
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Offers
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOffers}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Conversion Rate
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3 text-teal-500" />
            <span>+2.5% from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Price
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{stats.averagePriceEUR}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            <span>-4.3% from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Deals
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedDeals}</div>
          <p className="text-xs text-muted-foreground">
            +8% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
