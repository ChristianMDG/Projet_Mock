plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "mg.taxibrousse"
    compileSdk = 37

    signingConfigs {
        create("release") {
            storeFile = file("release.keystore")
            storePassword = "G%OAg#@K3l28"
            keyAlias = "taxibrousse-alias"
            keyPassword = "G%OAg#@K3l28"
        }
    }

    defaultConfig {
        applicationId = "mg.taxibrousse"
        minSdk = 24
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.androidx.junit)
}
