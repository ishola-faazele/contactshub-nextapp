"use client";
import { ContactType } from "@/types/types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Trash2,
  Star,
  Pencil,
  MoreVertical,
  Lock,
  Unlock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ContactCard component to display each contact and handle the modal
interface ContactCardInterface {
  contact: ContactType;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onChangeStatus: (id: string, status: string) => void;
}

const ContactCard: React.FC<ContactCardInterface> = ({
  contact,
  onDelete,
  onToggleFavorite,
  onChangeStatus,
}) => {
  // Truncate email function
  const truncateEmail = (email: string, maxLength = 15) => {
    if (email.length > maxLength) {
      return email.slice(0, 3) + "..." + email.slice(-10);
    }
    return email;
  };

  // Truncate name function
  const truncateName = (name: string, maxLength = 20) => {
    if (name.length > maxLength) {
      const names = name.split(" ");
      if (names.length > 1) {
        return `${names[0]} ... ${names[names.length - 1]}`;
      }
      return name.slice(0, maxLength - 3) + "...";
    }
    return name;
  };

  // Generate random color for avatar based on contact id
  const generateAvatarColor = (id: string) => {
    const colors = [
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-emerald-500",
    ];

    // Use the id to consistently select the same color for a contact
    const colorIndex =
      id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[colorIndex];
  };

  const getStatusMenuItems = () => {
    const status = contact.status || "active"; // Default to active if status is undefined

    if (status === "active") {
      return (
        <>
          <DropdownMenuItem>
            <Link
              href={`/contacts/${contact.id}`}
              className="flex items-center gap-2 w-full"
            >
              <Pencil className="w-4 h-4" /> Edit Contact
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChangeStatus(contact.id, "blocked")}
          >
            <Lock className="w-4 h-4" /> Block Contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(contact.id, "bin")}>
            <Trash2 className="w-4 h-4" /> Move To Bin
          </DropdownMenuItem>
        </>
      );
    } else if (status === "blocked") {
      return (
        <>
          <DropdownMenuItem
            onClick={() => onChangeStatus(contact.id, "active")}
          >
            <Unlock className="w-4 h-4" /> Unblock Contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(contact.id, "bin")}>
            <Trash2 className="w-4 h-4" /> Move To Bin
          </DropdownMenuItem>
        </>
      );
    } else if (status === "bin") {
      return (
        <>
          <DropdownMenuItem
            onClick={() => onChangeStatus(contact.id, "active")}
          >
            <RefreshCw className="w-4 h-4" /> Restore Contact
          </DropdownMenuItem>
        </>
      );
    }

    return null;
  };

  return (
    <motion.div
      key={contact.id}
      className="relative flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col px-2 py-3 w-48 md:w-64 shadow-md hover:shadow-lg transition-shadow rounded-2xl dark:bg-gray-800 cursor-pointer">
        {/* Header: Avatar + More Options */}
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <Avatar className="w-12 h-12 md:w-14 md:h-14">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback
              className={`${generateAvatarColor(
                contact.id
              )} text-white text-lg font-semibold`}
            >
              {contact.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row items-center gap-2 justify-between">
            <Star
              className={`w-5 h-5 ${
                contact.favorite ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer`}
              onClick={() => onToggleFavorite(contact.id)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {getStatusMenuItems()}
                <DropdownMenuItem onClick={() => onDelete(contact.id)}>
                  <XCircle className="w-4 h-4" /> Delete Forever
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Contact Details */}
        <CardContent className="py-1 space-y-2">
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {truncateName(contact.name)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{contact.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail
              size={16}
              className="text-gray-500 dark:text-gray-400 min-w-4"
            />
            <span className="truncate">{truncateEmail(contact.email)}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Phone
                size={16}
                className="text-gray-500 dark:text-gray-400 min-w-4"
              />
              <span className="truncate">{contact.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories outside the card */}
      <div className="flex flex-wrap gap-2 mt-2 ml-2">
        {contact.categories.length > 0 && (
          <>
            {contact.categories.length > 0 && (
              <span className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-full">
                {contact.categories[0]}
              </span>
            )}

            {contact.categories.length > 1 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
                      +{contact.categories.length - 1}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      {contact.categories.slice(1).map((category, index) => (
                        <p key={index}>{category}</p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ContactCard;
