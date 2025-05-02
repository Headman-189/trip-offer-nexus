
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, Search, Plane, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { TransportType } from "@/types";

// List of cities for autocomplete
const CITIES = [
  "Amsterdam", "Athens", "Barcelona", "Berlin", "Brussels", 
  "Budapest", "Copenhagen", "Dublin", "Edinburgh", "Florence", 
  "Frankfurt", "Geneva", "Hamburg", "Helsinki", "Lisbon", 
  "London", "Madrid", "Milan", "Munich", "Naples", 
  "Oslo", "Paris", "Prague", "Rome", "Stockholm", 
  "Valencia", "Venice", "Vienna", "Warsaw", "Zurich"
];

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Form state
  const [departureCity, setDepartureCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [transportType, setTransportType] = useState<TransportType>("flight");
  
  // Autocomplete state
  const [departureSuggestions, setDepartureSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  // Handle search input changes
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepartureCity(value);
    
    if (value.length > 0) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setDepartureSuggestions(filtered);
      setShowDepartureSuggestions(true);
    } else {
      setShowDepartureSuggestions(false);
    }
  };
  
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationCity(value);
    
    if (value.length > 0) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setDestinationSuggestions(filtered);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };
  
  const selectCity = (city: string, type: "departure" | "destination") => {
    if (type === "departure") {
      setDepartureCity(city);
      setShowDepartureSuggestions(false);
    } else {
      setDestinationCity(city);
      setShowDestinationSuggestions(false);
    }
  };
  
  const handleSearch = () => {
    if (!departureCity || !destinationCity || !departureDate) {
      return; // Validate form inputs
    }
    
    // Redirect to login or registration to continue
    navigate("/login", { 
      state: { 
        requestData: {
          departureCity,
          destinationCity,
          departureDate: format(departureDate, "yyyy-MM-dd"),
          returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
          transportType
        } 
      } 
    });
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDepartureSuggestions(false);
      setShowDestinationSuggestions(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">TripOfferNexus</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              {t("common.login")}
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="default" size="sm">
              {t("common.register")}
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="pt-12 pb-16 px-4 md:px-8 lg:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-slate-800 dark:text-white">
            {t("landingPage.title")}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {t("landingPage.subtitle")}
          </p>
        </div>
        
        {/* Search Card */}
        <Card className="max-w-4xl mx-auto mt-8 mb-16 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Departure City */}
              <div className="relative">
                <Label htmlFor="departureCity">{t("landingPage.from")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="departureCity"
                    value={departureCity}
                    onChange={handleDepartureChange}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (departureCity) {
                        setShowDepartureSuggestions(true);
                      }
                    }}
                    className="pl-8"
                    placeholder="Enter departure city"
                  />
                  <Search className="h-4 w-4 absolute left-2.5 top-3 text-slate-400" />
                  
                  {/* Suggestions Dropdown */}
                  {showDepartureSuggestions && departureSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 max-h-60 overflow-auto">
                      {departureSuggestions.map((city) => (
                        <div 
                          key={city} 
                          className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCity(city, "departure");
                          }}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Destination City */}
              <div className="relative">
                <Label htmlFor="destinationCity">{t("landingPage.to")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="destinationCity"
                    value={destinationCity}
                    onChange={handleDestinationChange}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (destinationCity) {
                        setShowDestinationSuggestions(true);
                      }
                    }}
                    className="pl-8"
                    placeholder="Enter destination city"
                  />
                  <Search className="h-4 w-4 absolute left-2.5 top-3 text-slate-400" />
                  
                  {/* Suggestions Dropdown */}
                  {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 max-h-60 overflow-auto">
                      {destinationSuggestions.map((city) => (
                        <div 
                          key={city} 
                          className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCity(city, "destination");
                          }}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Departure Date Picker */}
              <div>
                <Label htmlFor="departureDate">{t("landingPage.departureDate")}</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="departureDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? (
                          format(departureDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Return Date Picker */}
              <div>
                <Label htmlFor="returnDate">{t("landingPage.returnDate")}</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="returnDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? (
                          format(returnDate, "PPP")
                        ) : (
                          <span>Pick a date (optional)</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        disabled={(date) => departureDate ? date < departureDate : false}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Transport Type */}
              <div>
                <Label htmlFor="transportType">{t("landingPage.transportType")}</Label>
                <Select 
                  value={transportType}
                  onValueChange={(value) => setTransportType(value as TransportType)}
                >
                  <SelectTrigger className="w-full h-10 mt-1">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rail">
                      <div className="flex items-center">
                        <Train className="mr-2 h-4 w-4" />
                        <span>{t("landingPage.rail")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="flight">
                      <div className="flex items-center">
                        <Plane className="mr-2 h-4 w-4" />
                        <span>{t("landingPage.flight")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full mt-2 bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white">
              {t("landingPage.search")}
            </Button>
          </CardContent>
        </Card>
        
        {/* How It Works */}
        <div className="max-w-5xl mx-auto py-10">
          <h2 className="text-3xl font-bold mb-10 text-center text-slate-800 dark:text-white">
            {t("landingPage.howItWorks")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 flex items-center justify-center rounded-full mb-4">
                <span className="text-teal-600 dark:text-teal-300 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                {t("landingPage.step1")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Tell us where you want to go, when, and whether you need rail or flight tickets.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900 flex items-center justify-center rounded-full mb-4">
                <span className="text-brand-600 dark:text-brand-300 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                {t("landingPage.step2")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Travel agencies review your request and send you custom offers with all details.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 flex items-center justify-center rounded-full mb-4">
                <span className="text-teal-600 dark:text-teal-300 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                {t("landingPage.step3")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Compare all offers, select the best one, and make payment via bank transfer.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900 flex items-center justify-center rounded-full mb-4">
                <span className="text-brand-600 dark:text-brand-300 text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                {t("landingPage.step4")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Once payment is confirmed, receive your tickets instantly from the agency.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white">
                {t("landingPage.createAccount")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="mt-4 text-slate-600 dark:text-slate-300">
              {t("landingPage.alreadyMember")} <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">{t("landingPage.loginHere")}</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">TripOfferNexus</h3>
            <p className="text-slate-300">
              Connecting travelers with the perfect ticket offers from trusted agencies.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-slate-300 hover:text-white">Login</Link></li>
              <li><Link to="/register" className="text-slate-300 hover:text-white">Register</Link></li>
              <li><Link to="/" className="text-slate-300 hover:text-white">Home</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} TripOfferNexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
