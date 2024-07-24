export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Meal: {
        Row: {
          createdAt: string
          description: string
          id: string
          imagePath: string
          isInactive: boolean
          listPrice: number | null
          outdatedAt: string | null
          price: number
          restaurantId: string
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description: string
          id: string
          imagePath: string
          isInactive?: boolean
          listPrice?: number | null
          outdatedAt?: string | null
          price: number
          restaurantId: string
          title: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string
          id?: string
          imagePath?: string
          isInactive?: boolean
          listPrice?: number | null
          outdatedAt?: string | null
          price?: number
          restaurantId?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Meal_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      MealItem: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          mealId: string
          position: number
          price: number | null
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          mealId: string
          position: number
          price?: number | null
          title: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          mealId?: string
          position?: number
          price?: number | null
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "MealItem_mealId_fkey"
            columns: ["mealId"]
            isOneToOne: false
            referencedRelation: "Meal"
            referencedColumns: ["id"]
          },
        ]
      }
      MealItemOption: {
        Row: {
          createdAt: string
          extraPrice: number
          id: string
          mealItemId: string
          position: number
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          extraPrice: number
          id: string
          mealItemId: string
          position: number
          title: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          extraPrice?: number
          id?: string
          mealItemId?: string
          position?: number
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "MealItemOption_mealItemId_fkey"
            columns: ["mealItemId"]
            isOneToOne: false
            referencedRelation: "MealItem"
            referencedColumns: ["id"]
          },
        ]
      }
      OneTimePassword: {
        Row: {
          code: string
          id: string
          phoneNumber: string
        }
        Insert: {
          code: string
          id: string
          phoneNumber: string
        }
        Update: {
          code?: string
          id?: string
          phoneNumber?: string
        }
        Relationships: []
      }
      Order: {
        Row: {
          approvedByRestaurantAt: string | null
          canceledAt: string | null
          completedAt: string | null
          createdAt: string
          id: string
          isDiscounted: boolean
          orderNumber: number
          orderTotalPrice: number
          peopleCount: number
          restaurantId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          approvedByRestaurantAt?: string | null
          canceledAt?: string | null
          completedAt?: string | null
          createdAt?: string
          id: string
          isDiscounted?: boolean
          orderNumber?: number
          orderTotalPrice: number
          peopleCount: number
          restaurantId: string
          updatedAt?: string
          userId: string
        }
        Update: {
          approvedByRestaurantAt?: string | null
          canceledAt?: string | null
          completedAt?: string | null
          createdAt?: string
          id?: string
          isDiscounted?: boolean
          orderNumber?: number
          orderTotalPrice?: number
          peopleCount?: number
          restaurantId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Order_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderAutomaticCancellation: {
        Row: {
          createdAt: string
          googleCloudTaskId: string
          id: string
          orderId: string
        }
        Insert: {
          createdAt?: string
          googleCloudTaskId: string
          id: string
          orderId: string
        }
        Update: {
          createdAt?: string
          googleCloudTaskId?: string
          id?: string
          orderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrderAutomaticCancellation_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderCancellation: {
        Row: {
          cancelledAt: string
          cancelledBy: Database["public"]["Enums"]["CancellationUserType"]
          id: string
          orderId: string
          reason: Database["public"]["Enums"]["CancellationReason"]
        }
        Insert: {
          cancelledAt?: string
          cancelledBy: Database["public"]["Enums"]["CancellationUserType"]
          id: string
          orderId: string
          reason: Database["public"]["Enums"]["CancellationReason"]
        }
        Update: {
          cancelledAt?: string
          cancelledBy?: Database["public"]["Enums"]["CancellationUserType"]
          id?: string
          orderId?: string
          reason?: Database["public"]["Enums"]["CancellationReason"]
        }
        Relationships: [
          {
            foreignKeyName: "OrderCancellation_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderMeal: {
        Row: {
          createdAt: string
          id: string
          mealId: string
          orderId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          mealId: string
          orderId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          mealId?: string
          orderId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrderMeal_mealId_fkey"
            columns: ["mealId"]
            isOneToOne: false
            referencedRelation: "Meal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "OrderMeal_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderMealOption: {
        Row: {
          createdAt: string
          id: string
          mealItemOptionId: string
          orderMealId: string
        }
        Insert: {
          createdAt?: string
          id: string
          mealItemOptionId: string
          orderMealId: string
        }
        Update: {
          createdAt?: string
          id?: string
          mealItemOptionId?: string
          orderMealId?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrderMealOption_mealItemOptionId_fkey"
            columns: ["mealItemOptionId"]
            isOneToOne: false
            referencedRelation: "MealItemOption"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "OrderMealOption_orderMealId_fkey"
            columns: ["orderMealId"]
            isOneToOne: false
            referencedRelation: "OrderMeal"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderNotificationCall: {
        Row: {
          callId: string
          createdAt: string
          id: string
          orderId: string
          status: Database["public"]["Enums"]["OrderNotificationCallStatus"]
        }
        Insert: {
          callId: string
          createdAt?: string
          id: string
          orderId: string
          status: Database["public"]["Enums"]["OrderNotificationCallStatus"]
        }
        Update: {
          callId?: string
          createdAt?: string
          id?: string
          orderId?: string
          status?: Database["public"]["Enums"]["OrderNotificationCallStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "OrderNotificationCall_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      Payment: {
        Row: {
          additionalAmount: number
          completedAt: string | null
          createdAt: string
          id: string
          isCsvDownloaded: boolean
          orderId: string
          restaurantProfitPrice: number
          stripePaymentId: string
          totalAmount: number
          updatedAt: string
        }
        Insert: {
          additionalAmount: number
          completedAt?: string | null
          createdAt?: string
          id: string
          isCsvDownloaded?: boolean
          orderId: string
          restaurantProfitPrice: number
          stripePaymentId: string
          totalAmount: number
          updatedAt?: string
        }
        Update: {
          additionalAmount?: number
          completedAt?: string | null
          createdAt?: string
          id?: string
          isCsvDownloaded?: boolean
          orderId?: string
          restaurantProfitPrice?: number
          stripePaymentId?: string
          totalAmount?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Payment_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      Restaurant: {
        Row: {
          createdAt: string
          googleMapPlaceId: string
          id: string
          interiorImagePath: string | null
          isFullStatusAvailable: boolean
          isOpen: boolean
          isPublished: boolean
          name: string
          password: string
          phoneNumber: string | null
          smokingOption: Database["public"]["Enums"]["SmokingOption"] | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          googleMapPlaceId: string
          id: string
          interiorImagePath?: string | null
          isFullStatusAvailable?: boolean
          isOpen?: boolean
          isPublished?: boolean
          name: string
          password: string
          phoneNumber?: string | null
          smokingOption?: Database["public"]["Enums"]["SmokingOption"] | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          googleMapPlaceId?: string
          id?: string
          interiorImagePath?: string | null
          isFullStatusAvailable?: boolean
          isOpen?: boolean
          isPublished?: boolean
          name?: string
          password?: string
          phoneNumber?: string | null
          smokingOption?: Database["public"]["Enums"]["SmokingOption"] | null
          updatedAt?: string
        }
        Relationships: []
      }
      RestaurantBankAccount: {
        Row: {
          accountNo: string
          accountType: Database["public"]["Enums"]["BankAccountType"]
          bankCode: string
          branchCode: string
          clientCode: number
          createdAt: string
          holderName: string
          id: string
          isAdminConfirmed: boolean
          restaurantId: string
          updatedAt: string
        }
        Insert: {
          accountNo: string
          accountType: Database["public"]["Enums"]["BankAccountType"]
          bankCode: string
          branchCode: string
          clientCode?: number
          createdAt?: string
          holderName: string
          id: string
          isAdminConfirmed?: boolean
          restaurantId: string
          updatedAt?: string
        }
        Update: {
          accountNo?: string
          accountType?: Database["public"]["Enums"]["BankAccountType"]
          bankCode?: string
          branchCode?: string
          clientCode?: number
          createdAt?: string
          holderName?: string
          id?: string
          isAdminConfirmed?: boolean
          restaurantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantBankAccount_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantClosedAlert: {
        Row: {
          closedAt: string
          id: string
          notifiedAt: string | null
          openAt: string | null
          restaurantId: string
        }
        Insert: {
          closedAt?: string
          id: string
          notifiedAt?: string | null
          openAt?: string | null
          restaurantId: string
        }
        Update: {
          closedAt?: string
          id?: string
          notifiedAt?: string | null
          openAt?: string | null
          restaurantId?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantClosedAlert_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantCoordinate: {
        Row: {
          createdAt: string
          id: string
          point: unknown | null
          restaurantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          point?: unknown | null
          restaurantId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          point?: unknown | null
          restaurantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantCoordinate_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantFullStatus: {
        Row: {
          easedAt: string | null
          id: string
          restaurantId: string
          startedAt: string
        }
        Insert: {
          easedAt?: string | null
          id: string
          restaurantId: string
          startedAt?: string
        }
        Update: {
          easedAt?: string | null
          id?: string
          restaurantId?: string
          startedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantFullStatus_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantGoogleMapOpeningHour: {
        Row: {
          closeDayOfWeek: Database["public"]["Enums"]["DayOfWeek"]
          closeHour: number
          closeMinute: number
          createdAt: string
          id: string
          isAutomaticallyApplied: boolean
          openDayOfWeek: Database["public"]["Enums"]["DayOfWeek"]
          openHour: number
          openMinute: number
          restaurantId: string
          updatedAt: string
        }
        Insert: {
          closeDayOfWeek: Database["public"]["Enums"]["DayOfWeek"]
          closeHour: number
          closeMinute: number
          createdAt?: string
          id: string
          isAutomaticallyApplied?: boolean
          openDayOfWeek: Database["public"]["Enums"]["DayOfWeek"]
          openHour: number
          openMinute: number
          restaurantId: string
          updatedAt?: string
        }
        Update: {
          closeDayOfWeek?: Database["public"]["Enums"]["DayOfWeek"]
          closeHour?: number
          closeMinute?: number
          createdAt?: string
          id?: string
          isAutomaticallyApplied?: boolean
          openDayOfWeek?: Database["public"]["Enums"]["DayOfWeek"]
          openHour?: number
          openMinute?: number
          restaurantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantGoogleMapOpeningHour_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantGoogleMapPlaceInfo: {
        Row: {
          createdAt: string
          id: string
          latitude: number
          longitude: number
          restaurantId: string
          updatedAt: string
          url: string
        }
        Insert: {
          createdAt?: string
          id: string
          latitude: number
          longitude: number
          restaurantId: string
          updatedAt?: string
          url: string
        }
        Update: {
          createdAt?: string
          id?: string
          latitude?: number
          longitude?: number
          restaurantId?: string
          updatedAt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantGoogleMapPlaceInfo_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantMenuImage: {
        Row: {
          createdAt: string
          id: string
          imagePath: string
          menuNumber: number
          restaurantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          imagePath: string
          menuNumber: number
          restaurantId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          imagePath?: string
          menuNumber?: number
          restaurantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantMenuImage_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      RestaurantPaymentOption: {
        Row: {
          createdAt: string
          id: string
          option: Database["public"]["Enums"]["PaymentOption"]
          restaurantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          option: Database["public"]["Enums"]["PaymentOption"]
          restaurantId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          option?: Database["public"]["Enums"]["PaymentOption"]
          restaurantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RestaurantPaymentOption_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Staff: {
        Row: {
          createdAt: string
          id: string
          lineId: string
          restaurantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          lineId: string
          restaurantId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          lineId?: string
          restaurantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Staff_restaurantId_fkey"
            columns: ["restaurantId"]
            isOneToOne: false
            referencedRelation: "Restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      StripeCustomer: {
        Row: {
          createdAt: string
          id: string
          stripeCustomerId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          stripeCustomerId: string
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          stripeCustomerId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "StripeCustomer_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          phoneNumber: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          phoneNumber?: string | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          phoneNumber?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_nearby_restaurants: {
        Args: {
          lat: number
          long: number
        }
        Returns: {
          id: string
          distance: number
        }[]
      }
    }
    Enums: {
      BankAccountType: "SAVINGS" | "CHECKING" | "DEPOSIT"
      CancellationReason:
        | "FULL"
        | "USER_DEMAND"
        | "CLOSED"
        | "LATE"
        | "CALL_NO_ANSWER"
        | "NO_ACTION_AFTER_CALL"
      CancellationUserType: "USER" | "STAFF"
      DayOfWeek:
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY"
        | "SUNDAY"
      OrderNotificationCallStatus: "IN_PROGRESS" | "ANSWERED" | "NO_ANSWER"
      PaymentOption: "CASH" | "CREDIT_CARD" | "E_MONEY" | "QR_CODE"
      SmokingOption:
        | "SMOKING"
        | "NON_SMOKING"
        | "SEPARATED"
        | "SEPARATED_ONLY_E_CIGARETTE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

